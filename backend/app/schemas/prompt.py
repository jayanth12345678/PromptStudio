from pydantic import BaseModel, Field


class PromptEnhanceRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=5000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=1.0, gt=0.0, le=1.0)

    # Prompt engineering options
    role: str | None = None
    context: str | None = None
    output_format: str | None = None
    constraints: str | None = None


class PromptEnhanceResponse(BaseModel):
    original_prompt: str
    enhanced_prompt: str


class AnswerGenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=5000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=1.0, gt=0.0, le=1.0)


class AnswerGenerateResponse(BaseModel):
    prompt: str
    answer: str