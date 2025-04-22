import spacy
import re

nlp = spacy.load("en_core_web_sm")

def lambda_handler(event, context):
    try:
        text = event['text']
        doc = nlp(text)

        def extract_name():
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    return ent.text
            return None

        def extract_email():
            match = re.search(r"[\w\.-]+@[\w\.-]+", text)
            return match.group(0) if match else None

        def extract_phone():
            match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
            return match.group(0) if match else None

        def extract_education():
            keywords = ["bachelor", "master", "phd", "degree", "university", "college"]
            return [sent.text for sent in doc.sents if any(k in sent.text.lower() for k in keywords)]

        def extract_experience():
            keywords = ["experience", "worked", "internship", "employment", "company"]
            return [sent.text for sent in doc.sents if any(k in sent.text.lower() for k in keywords)]

        return {
            'statusCode': 200,
            'data': {
                'name': extract_name(),
                'email': extract_email(),
                'phone_number': extract_phone(),
                'education': extract_education(),
                'experience': extract_experience()
            }
        }

    except Exception as e:
        return {'statusCode': 500, 'error': str(e)}
