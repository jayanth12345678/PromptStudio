
import os
from dotenv import load_dotenv
from groq import Groq, APIError

load_dotenv()

import logging

logger = logging.getLogger(__name__)


enhancer_client = Groq(
    api_key = os.getenv("GROQ_ENHANCER_API_KEY")
)


def enhance_prompt_service(
    prompt: str,
    temperature: float = 0.7,
    top_p: float = 1.0,
    role: str | None = None,
    context: str | None = None,
    constraints: str | None = None,
    output_format: str | None = None,
) -> str:


    
    instructions = f"""
    You are an expert prompt engineer.

    Your job is to rewrite the user's original prompt into a
    clear, specific, structured, and effective prompt for another AI.

    Use the following preferences when improving the prompt:

    Role: {role or "Choose an appropriate role based on the task."}

    Context: {context or "Use only the context provided in the original prompt. Do not invent facts."}

    Output format: {output_format or "Choose a suitable output format for the task."}

    Constraints: {constraints or "Preserve any constraints in the original prompt."}

    Organize the improved prompt using these components where relevant:

    1. Role
    2. Context
    3. Task
    4. Constraints
    5. Output format
    6. Quality criteria

    Preserve the user's original intent. Do not invent facts or
    unnecessary requirements.

    IMPORTANT:
    - Do not answer the original question.
    - Do not explain the changes you made.
    - Do not include introductory commentary.
    - Return only the completed, improved prompt.
    """

    try:
        response = enhancer_client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": instructions
                },
                {
                    "role": "user",
                    "content": prompt
                }
                
            ],
            temperature=temperature,
            top_p=top_p
        )
            
        answer = response.choices[0].message.content
        return answer

    except APIError:
        logger.exception("Groq API error")
        raise


