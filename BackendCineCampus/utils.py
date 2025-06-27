from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from starlette.responses import JSONResponse

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

async def create_jwt_token(user_id: str):
    # Set the expiration time for the token (e.g., 24 hour)
    expiration_time = datetime.now(timezone.utc) + timedelta(hours=24)

    # Define the payload (the data you want to include in the token)
    payload = {
        "user_id": user_id,  # Include user-specific data, like user ID
        "exp": expiration_time,  # Set the expiration time of the token
    }

    # Create the JWT token using the payload and secret key
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return token

async def decode_jwt_token(token: str):
    try:
        # Decode the token using the secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # Return the decoded payload (user ID and expiration time)
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
    
class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        if request.url.path in ["/docs", "/redoc", "/openapi.json", "/login", "/register", "/"]:
            response = await call_next(request)
            return response
        
        # Get the token from the Authorization header
        token = request.headers.get("Authorization")
        if not token:
            return JSONResponse({"detail": "Token is missing"}, status_code=401)
        
        token = token.replace("Bearer ", "")  # Remove 'Bearer ' prefix if present
        payload = await decode_jwt_token(token)
        
        if payload:
            # Attach the user ID to the request state so routes can use it
            request.state.user_id = payload["user_id"]
        else:
            return JSONResponse({"detail": "Invalid or expired token"}, status_code=401)
    
        # Proceed to the next middleware or route handler
        response = await call_next(request)
        return response