
import os
from dotenv import load_dotenv
from groq import Groq, APIError

load_dotenv()

import logging

logger = logging.getLogger(__name__)

answer_client = Groq(
    api_key = os.getenv("GROQ_ANSWER_API_KEY")
)


def generate_answer(prompt: str, temperature: float = 0.7, top_p: float = 1.0) -> str:
    try:
        response = answer_client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature = temperature,
            top_p =top_p
        )

        answer = response.choices[0].message.content
        return answer

    except APIError:
        logger.exception("Groq API error")
        raise
