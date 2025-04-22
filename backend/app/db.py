from pymongo import MongoClient

client = MongoClient('mongodb+srv://ayussh222dongol:aayush@cluster0.kne3ujo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['resume_db']
collection = db['parsed_resumes']

def save_parsed_data(parsed_details):
    try:
        collection.insert_one(parsed_details)
    except Exception as e:
        raise Exception(f"Error saving data to MongoDB: {str(e)}")

def get_parsed_data():
    try:
        data = list(collection.find())
        return data
    except Exception as e:
        raise Exception(f"Error fetching data from MongoDB: {str(e)}")
