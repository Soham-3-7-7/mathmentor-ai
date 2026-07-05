import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from google import genai
from google.genai import types

app = FastAPI()

# Enable CORS so your Node/React app can connect during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Gemini Client (Make sure GEMINI_API_KEY is set in your environment variables)
# Uses the modern, unified Google GenAI SDK
client = genai.Client()

# --- Pydantic Data Schemas ---
class DoubtRequest(BaseModel):
    question: str
    student_attempt: Optional[str] = None

class TestQuestionResponse(BaseModel):
    question_id: str
    selected_option: str
    correct_option: str
    time_taken_seconds: int

class AnalysisRequest(BaseModel):
    test_history: List[TestQuestionResponse]

# --- Endpoint 1: Doubt Solver Agent ---
@app.post("/api/solve")
async def solve_doubt(data: DoubtRequest):
    try:
        # We craft a structured prompt pushing Gemini to act as the Evaluation Critic & Solver
        prompt = f"You are an expert JEE/NEET AI Coach. Analyze the following information.\nQuestion: {data.question}\n"
        if data.student_attempt:
            prompt += f"Student's Attempt/Answer: {data.student_attempt}\n"
            prompt += "Evaluate the student's attempt. Identify the exact step where an error occurred. Categorize it as Calculation, Logic, or Speed error. Provide the correct solution and a time-saving shortcut."
        else:
            prompt += "Provide a complete step-by-step textbook solution and an optimized competitive exam shortcut method."
        
        prompt += "\nFormat your response neatly with clear sections."

        # Requesting structural thinking from gemini-2.5-flash
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return {"analysis": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Endpoint 2: Thinking Pattern Analyzer ---
@app.post("/api/analyze-test")
async def analyze_test(data: AnalysisRequest):
    try:
        # Serialize the test performance into a text format for the model to digest
        history_summary = ""
        for index, item in enumerate(data.test_history):
            history_summary += f"Q{index+1}: Chosen={item.selected_option}, Correct={item.correct_option}, TimeTaken={item.time_taken_seconds}s\n"

        prompt = f"""
        You are an advanced cognitive diagnostic agent evaluating a student's competitive test data.
        Analyze this raw question breakdown to evaluate their psychological and academic performance profile:
        
        {history_summary}
        
        Calculate metrics and return raw JSON matching exactly this structure:
        {{
            "thinking_pattern_summary": "Short paragraph analyzing their performance habits.",
            "learning_dna": {{
                "speed": 85, 
                "logic": 60,
                "calculation": 45
            }},
            "suggested_difficulty_adjustment": "Decrease to Medium"
        }}
        Only return valid JSON, no markdown formatting blocks.
        """

        # Enforce structured JSON output directly via configuration options
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        return response.text
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
