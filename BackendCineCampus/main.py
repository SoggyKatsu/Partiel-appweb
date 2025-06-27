from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from typing import Annotated
import models
from utils import hash_password, verify_password, JWTMiddleware, create_jwt_token
from datetime import datetime
from fastapi.encoders import jsonable_encoder

app = FastAPI()

app.add_middleware(JWTMiddleware)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Register(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

class Login(BaseModel):
    username: str
    password: str

class Movie(BaseModel):
    title: str
    description: str
    year: int | None = None
    genre: str | None = None

class User(BaseModel):
    id: int
    username: str
    email: str
    password: str
    created_at: datetime = datetime.now()

class Review(BaseModel):
    id: int
    movie_id: int
    user_id: int
    comment: str | None = None
    created_at: datetime = datetime.now()

class PostReview(BaseModel):
    comment: str

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine) 

@app.get("/")
async def read_root():
    return JSONResponse(
        content={"message": "Welcome to the Movie API"},
        status_code=200
    )

@app.post("/register")
async def create_user(body: Register, db: Session = Depends(get_db)):
    username = body.username
    email = body.email
    password = body.password
    confirm_password = body.confirm_password
    
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(password)
    new_user = models.User(username=username, email=email, password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return JSONResponse(
        content={"success": True},
        status_code=201
    )

@app.post("/login")
async def login_user(body: Login, db: Session = Depends(get_db)):
    username = body.username
    password = body.password
    
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="user not found")
    
    if db_user.username != username:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not verify_password(password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    token = await create_jwt_token(db_user.id)
    return JSONResponse(
        content={"success": True, "token": token},
        status_code=200
    )

@app.get("/users", response_model=list[User])
async def get_users(request: Request, db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return JSONResponse(
        content=[
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            } for user in users
        ],
        status_code=200
    )

@app.post("/movies")
async def create_movie(body: Movie, request: Request, db: Session = Depends(get_db)):
    title = body.title
    description = body.description
    year = body.year
    genre = body.genre
    if not title or not description:
        raise HTTPException(status_code=400, detail="Title and description are required")
    
    user_id = getattr(request.state, "user_id", None)
    new_movie = models.Movie(user_id=user_id, title=title, description=description, year=year, genre=genre)
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)

    return JSONResponse(
        content={"success": True},
        status_code=201
    )

@app.get("/movies")
async def get_movies(request: Request, db: Session = Depends(get_db)):
    
    movie_list = db.query(models.Movie).all()
    json_compatible_data = jsonable_encoder(movie_list)

    return JSONResponse(
        content=json_compatible_data,
        status_code=200
    )

@app.get("/movies/{movie_id}")
async def get_movie(movie_id: int, request: Request, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    return JSONResponse(
        content={
            "details": {
                "id": movie.id,
                "user_id": movie.user_id,
                "title": movie.title,
                "description": movie.description,
                "year": movie.year,
                "genre": movie.genre
            },
            "reviews": [
                {
                    "id": review.id,
                    "movie_id": review.movie_id,
                    "user_id": review.user_id,
                    "username": review.user.username if review.user else None,
                    "comment": review.comment,
                    "created_at": review.created_at.isoformat()
                } for review in movie.reviews
            ]
        },
        status_code=200
    )

@app.post("/movies/{movie_id}/reviews")
async def create_review(movie_id: int, body: PostReview, request: Request, db: Session = Depends(get_db)):
    comment = body.comment
    user_id = getattr(request.state, "user_id", None)
    
    if not comment:
        raise HTTPException(status_code=400, detail="Comment is required")
    
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    new_review = models.Review(movie_id=movie_id, user_id=user_id, comment=comment)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return JSONResponse(
        content={"success": True},
        status_code=201
    )