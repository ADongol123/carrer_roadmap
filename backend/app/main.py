from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from s3_utils import upload_to_s3
from textract_utils import extract_text_from_s3
from parser import ResumeParser
from db import save_parsed_data, get_parsed_data
from models import ResumeDetails
from db import save_parsed_data, get_parsed_data
import pdfplumber
from datetime import datetime
import os 
import io
import tempfile
import base64
import json
from models import UserRegister, UserLogin
from auth.auth_utils import hash_password, verify_password, create_access_token
from fastapi.responses import JSONResponse
from auth.dependencies import get_current_user,decode_token
import boto3
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from bson import ObjectId
from roadmap_generator import generate_roadmap_with_llama
from db import collection,db
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv


load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_AWS_SESSION_TOKEN = os.getenv('AWS_AWS_SESSION_TOKEN')


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or a list of allowed origins, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods, e.g., GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allows all headers
)

# Lambda function names
UPLOAD_RESUME_LAMBDA = "upload_resume_lambda"
PARSE_RESUME_LAMBDA = "parser_resume_lambda"
NLP_RESUME_PARSER_LAMBDA = "nlp_resume_parser_lambda"

# AWS Clients
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_AWS_SESSION_TOKEN
)

lambda_client = boto3.client(
    'lambda',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_AWS_SESSION_TOKEN
)

# Lambda Invoker

def invoke_lambda(function_name, payload):
    try:
        response = lambda_client.invoke(
            FunctionName=function_name,
            InvocationType='RequestResponse',
            Payload=json.dumps(payload)
        )
        # Read and decode the raw response body
        payload_raw = response['Payload'].read().decode('utf-8')

        # Parse the response directly as JSON
        parsed = json.loads(payload_raw)

        # If the response is a string within a dictionary under 'body', re-parse it
        if isinstance(parsed, dict) and 'body' in parsed:
            body = parsed['body']
            if isinstance(body, str):
                return json.loads(body)
            return body

        return parsed

    except Exception as e:
        raise Exception(f"Error invoking Lambda {function_name}: {str(e)}")




# Upload Resume Endpoint

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    try:
        file_content = await file.read()

        # Step 1: Upload resume to S3 (through Lambda)
        upload_payload = {
            "file_name": file.filename,
            "file_content": base64.b64encode(file_content).decode('utf-8')
        }
        upload_response = invoke_lambda(UPLOAD_RESUME_LAMBDA, upload_payload)
        
        # Safely access the 's3_uri'
        if isinstance(upload_response, dict):
            s3_uri = upload_response['s3_uri']
            print("s3_uri:", s3_uri)
        else:
            raise Exception(f"Expected a dict, but got {type(upload_response)}")

        if not s3_uri:
            raise Exception("S3 URI not returned from upload lambda.")

        # Step 2: Parse resume (through Lambda)
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        

        # Step 3: NLP parse resume (through Lambda)
        nlp_payload = {"text": text}
        nlp_response = invoke_lambda(NLP_RESUME_PARSER_LAMBDA, nlp_payload)
        parsed_data = nlp_response.get('data')
        # print("nlp_payload", nlp_payload)
        # print("nlp_response", nlp_response)
        # print("parsed_data", parsed_data)
        
        parsed_data_with_meta = {
            **parsed_data,
            "file_name": file.filename,
            "s3_uri": s3_uri
        }
        
        save_payload = {"parsed_data": parsed_data_with_meta}
        save_response = invoke_lambda("connect_database_lambda", save_payload)
        print("save_response:", save_response)
        # print("Received parsed_data:", parsed_data)
        return {
            "message": "Upload and parsing successful",
            "resume_id":save_response.get("resume_id"),
            "s3_uri": s3_uri,
            "parsed_data": parsed_data
        }

    except Exception as e:
        return {"error": str(e)}


def serialize_document(doc):
    """Helper to convert MongoDB ObjectId to string"""
    doc['_id'] = str(doc['_id'])
    return doc

roadmaps_collection = db["roadmaps"]  

@app.get("/generate_roadmap/{resume_id}/")
async def generate_roadmap(resume_id: str, user: str = Depends(get_current_user)):
    try:
        # Step 1: Fetch resume data
        parsed_resume = collection.find_one({"_id": ObjectId(resume_id)})

        if not parsed_resume:
            raise HTTPException(status_code=404, detail="Resume not found.")
        
        parsed_resume = serialize_document(parsed_resume)

        # Step 2: Extract skills, education, and experience
        skills = parsed_resume.get('skills', [])
        education = parsed_resume.get('education', [])
        experience = parsed_resume.get('experience', [])

        if not (skills or education or experience):
            return JSONResponse(status_code=400, content={"message": "Incomplete resume data for generating roadmap."})

        # Step 3: Generate roadmap
        roadmap = generate_roadmap_with_llama(skills, education, experience)
        print(roadmap,"roadmap")

        user_id = user.get("sub")
        print(user_id,"user_id")
        # Step 4: Save to MongoDB
        roadmap_entry = {
            "resume_id": resume_id,
            "username": user_id,
            "generated_at": datetime.utcnow(),
            "roadmap": roadmap
        }
        print("roadmap_entry:", user)
        result = roadmaps_collection.insert_one(roadmap_entry)

        return {
            "resume_data": parsed_resume,
            "career_roadmap": roadmap,
            "roadmap_id": str(result.inserted_id)
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error generating roadmap: {str(e)}"})

# Retrieve Parsed Data Endpoint

@app.get("/get_parsed_data/")
async def get_resume_data():
    try:
        data = get_parsed_data()
        return {"data": data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})
    
    
    
@app.get("/my_roadmaps/")
async def get_my_roadmaps(user: str = Depends(get_current_user)):
    try:
        print("1515",user)
        roadmaps = roadmaps_collection.find({"username": user})
        for roadmap in roadmaps:
            roadmap["_id"] = str(roadmap["_id"])
            roadmap["resume_id"] = str(roadmap["resume_id"])
        return {"roadmaps": roadmaps}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})
    
#-------------------------------------Login---------------------------------------------


users_collection = db["users"]

@app.post("/register/")
def register(user: UserRegister):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_pw = hash_password(user.password)
    users_collection.insert_one({"username": user.username, "password": hashed_pw})
    return {"message": "User registered successfully"}

@app.post("/login/")
def login(user: UserLogin):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
