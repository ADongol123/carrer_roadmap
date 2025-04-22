import boto3
import os
from dotenv import load_dotenv


load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_AWS_SESSION_TOKEN = os.getenv('AWS_AWS_SESSION_TOKEN')

textract_client =  boto3.client(
    'textract',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_AWS_SESSION_TOKEN
)


def extract_text_from_s3(file_location):
    """
    Extracts text from a PDF document stored in an S3 bucket using AWS Textract.

    Args:
        file_location (str): The S3 path (object key) of the document to process.

    Returns:
        str: The extracted text from the document.

    Raises:
        Exception: If an error occurs during the Textract call.
    """
    try:
        # Call Textract to process the document
        response = textract_client.detect_document_text(
            Document={'S3Object': {'Bucket': 'resume-parser-aws-team5', 'Name': file_location}}
        )

        # Initialize a variable to store the extracted text
        text = ""

        # Loop through the response blocks to extract text
        for item in response['Blocks']:
            if item['BlockType'] == 'LINE':
                text += item['Text'] + "\n"

        return text
    except Exception as e:
        # Handle errors during the Textract API call
        raise Exception(f"Error extracting text with Textract: {str(e)}")