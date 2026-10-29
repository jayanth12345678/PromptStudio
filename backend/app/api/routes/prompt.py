from fastapi import APIRouter, HTTPException
from groq import APIError

from app.schemas.prompt import PromptEnhanceRequest, PromptEnhanceResponse, AnswerGenerateRequest, AnswerGenerateResponse
from app.services.llm_service import generate_answer
from app.services.prompt_service import enhance_prompt_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/enhance", response_model = PromptEnhanceResponse)
def enhance_prompt(request: PromptEnhanceRequest):
    try:
        enhanced_prompt = enhance_prompt_service(prompt = request.prompt, temperature = request.temperature, top_p = request.top_p, role = request.role, context = request.context, output_format = request.output_format, constraints = request.constraints)
        return PromptEnhanceResponse(original_prompt = request.prompt, enhanced_prompt = enhanced_prompt)
    except APIError:
        raise HTTPException(
            status_code=502,
            detail="The AI service is temporarily unavailable. Please try again."
        )
    except Exception:
        logger.exception("Unexpected error while processing question")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong. Please try again."
        )


@router.get("/")
def root():
    return {"message": "Hello from our API router"}


@router.post("/answer", response_model=AnswerGenerateResponse)
def ask_question(request: AnswerGenerateRequest):
    try:
        answer = generate_answer(prompt = request.prompt, temperature = request.temperature, top_p = request.top_p)

        return AnswerGenerateResponse(prompt = request.prompt, answer = answer)

    except APIError:
        raise HTTPException(
            status_code=502,
            detail="The AI service is temporarily unavailable. Please try again."
        )
    except Exception:
        logger.exception("Unexpected error while processing question")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong. Please try again."
        )
