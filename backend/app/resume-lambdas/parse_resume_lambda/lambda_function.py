import boto3
import fitz  # PyMuPDF
import io
import os

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('resume-parser-aws-team5', 'resume-parser-aws-team5')

def lambda_handler(event, context):
    try:
        file_name = event['file_name']
        s3_response = s3.get_object(Bucket='resume-parser-aws-team5', Key=f'resumes/{file_name}')
        file_stream = io.BytesIO(s3_response['Body'].read())

        doc = fitz.open(stream=file_stream, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()

        return {
            'statusCode': 200,
            'text': text
        }

    except Exception as e:
        return {'statusCode': 500, 'error': str(e)}
