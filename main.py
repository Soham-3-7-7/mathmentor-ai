from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
from google import genai
from google.genai import types

app = FastAPI()

# Initialize Gemini Client (Reads GEMINI_API_KEY from environment)
client = genai.Client()

class DoubtRequest(BaseModel):
    question: str
    student_solution: Optional[str] = None

class AnalysisRequest(BaseModel):
    questions_context: List[dict] # Contains question, student answer, time taken, scratchpad

@app.post("/api/ai/doubt-solver")
async def solve_doubt(data: DoubtRequest):
    prompt = f"""
    You are an expert JEE/NEET Mentor AI.
    Analyze the following math/science question: "{data.question}"
    """
    if data.student_solution:
        prompt += f"\nThe student attempted it this way: '{data.student_solution}'. Spot any analytical, logical, or calculation errors, point them out gently, provide a beautifully optimal solution step, and provide 2 similar core mock practice questions."
    else:
        prompt += "\nProvide a clear step-by-step solution, alternative faster solving methods, and 2 similar structural practice problems."

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return {"analysis": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/pattern-analyzer")
async def analyze_pattern(data: AnalysisRequest):
    prompt = f"""
    Analyze this exam session data to extract a high-fidelity learning profile.
    Session logs: {data.questions_context}
    
    Output a structured evaluation matching these criteria:
    1. Learning DNA Matrix (Speed index, Logic strength, Calculation accuracy).
    2. Thinking Pattern Flaws (e.g., jumping to conclusions, getting stuck on algebra).
    3. Next Test Difficulty Modifier (Return a float scalar between -0.5 and +0.5 to adjust dynamic question difficulties).
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return {"analysis": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
