
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from app.api.routes.prompt import router as prompt_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    
    allow_origins=[
    "http://localhost:5173",
    "https://prompt-studio-frontend.onrender.com",
    ],

    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prompt_router)
