import boto3
import base64
import os

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('BUCKET_NAME', 'resume-parser-aws-team5')

def lambda_handler(event, context):
    try:
        file_name = event['file_name']
        file_content_base64 = event['file_content']  # base64 encoded string
        file_content = base64.b64decode(file_content_base64)

        s3.put_object(Bucket='resume-parser-aws-team5', Key=f'resumes/{file_name}', Body=file_content)

        return {
            'statusCode': 200,
            'message': f'Uploaded to s3://resume-parser-aws-team5/resumes/{file_name}'
        }

    except Exception as e:
        return {'statusCode': 500, 'error': str(e)}
