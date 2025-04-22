from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from auth.auth_utils import decode_token



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token:str = Depends(oauth2_scheme)):
    username = decode_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username