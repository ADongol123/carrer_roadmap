import spacy
import re

class ResumeParser:
    def __init__(self, text):
        self.text = text
        self.nlp = spacy.load('en_core_web_sm')
        self.doc = self.nlp(self.text)
        self.details = {
            'name': None,
            'email': None,
            'phone_number': None,
            'skills': [],
            'education': [],
            'experience': []
        }
        self.parse_details()

    def parse_details(self):
        self.details['name'] = self.extract_name()
        self.details['email'] = self.extract_email()
        self.details['phone_number'] = self.extract_phone()
        self.details['skills'] = self.extract_skills()
        self.details['education'] = self.extract_education()
        self.details['experience'] = self.extract_experience()

    def extract_name(self):
        for ent in self.doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        return None

    def extract_email(self):
        match = re.search(r"[\w\.-]+@[\w\.-]+", self.text)
        return match.group(0) if match else None

    def extract_phone(self):
        match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", self.text)
        return match.group(0) if match else None

    def extract_skills(self):
        tokens = [token.text.lower() for token in self.doc if not token.is_stop and not token.is_punct]
        return list(set(tokens))

    def extract_education(self):
        education_keywords = ["bachelor", "master", "phd", "degree", "university", "college"]
        return [sent.text for sent in self.doc.sents if any(word in sent.text.lower() for word in education_keywords)]

    def extract_experience(self):
        experience_keywords = ["experience", "worked", "internship", "employment", "company"]
        return [sent.text for sent in self.doc.sents if any(word in sent.text.lower() for word in experience_keywords)]

    def get_extracted_data(self):
        return self.details
