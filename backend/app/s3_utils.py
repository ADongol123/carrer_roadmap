import boto3
from botocore.exceptions import BotoCoreError, ClientError
import os
from dotenv import load_dotenv


load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_AWS_SESSION_TOKEN = os.getenv('AWS_AWS_SESSION_TOKEN')
# Pass credentials directly
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_AWS_SESSION_TOKEN
)
def upload_to_s3(file, file_location, bucket_name='resume-parser-aws-team5'):
    try:
        s3_client.upload_fileobj(file, bucket_name, file_location)
        print(f"Upload successful to s3://{bucket_name}/")
        return f"s3://{bucket_name}/{file_location}"
    except (BotoCoreError, ClientError) as e:
        raise Exception(f"Error uploading file to S3: {str(e)}")