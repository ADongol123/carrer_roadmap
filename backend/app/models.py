from pydantic import BaseModel
from typing import List, Optional




class ResumeDetails(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    skills: List[str]
    education: List[str]
    experience: List[str]



class UserRegister(BaseModel):
    username: str
    password: str
    



class UserLogin(BaseModel):
    username: str
    password: str
