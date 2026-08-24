"""
EmpathAI Backend - FastAPI Server
Main application file for emotion detection, harassment detection, and AI response generation.
"""

import sys
import os

# Ensure stdout and stderr handle utf-8 safely on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from collections import defaultdict
import uvicorn
from dotenv import load_dotenv

from models.emotion_model import EmotionModel
from models.harassment_model import HarassmentModel
from utils.generate_response import ResponseGenerator
from utils.logger import HarassmentLogger, log_user_interaction
import json

print(">>> APP LOADING from:", __file__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="EmpathAI Backend",
    description="Emotional, mental, and legal support companion API",
    version="1.0.0"
)

# CORS middleware - allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models (cached for performance)
emotion_model = None
harassment_model = None
response_generator = None
harassment_logger = None
ipc_data = []

# Conversation memory: stores chat history per user_id
conversation_history = defaultdict(list)

@app.get("/api/debug-response")
async def debug_response():
    """Debug endpoint to check ResponseGenerator methods."""
    if response_generator is None:
        return {"error": "ResponseGenerator is None"}
    
    methods = [method for method in dir(response_generator) if not method.startswith('_')]
    has_generate = 'generate' in methods
    
    return {
        "has_generate_method": has_generate,
        "available_methods": methods,
        "gemini_available": getattr(response_generator, 'available', False)
    }

@app.on_event("startup")
async def startup_event():
    """Initialize models on server startup for faster response times."""
    global emotion_model, harassment_model, response_generator, harassment_logger, ipc_data
    
    print("[INIT] Initializing EmpathAI models...")
    
    try:
        emotion_model = EmotionModel()
        print("[OK] Emotion model loaded")
    except Exception as e:
        print(f"[WARN] Error loading emotion model: {e}")
        emotion_model = EmotionModel()
    
    try:
        harassment_model = HarassmentModel()
        print("[OK] Harassment model loaded")
    except Exception as e:
        print(f"[WARN] Error loading harassment model: {e}")
        harassment_model = HarassmentModel()
    
    try:
        response_generator = ResponseGenerator()
        print("[OK] Response generator initialized")
    except Exception as e:
        print(f"[WARN] Response generator notice: {e}")
        response_generator = ResponseGenerator()
    
    try:
        harassment_logger = HarassmentLogger()
        print("[OK] Harassment logger initialized")
    except Exception as e:
        print(f"[WARN] Logger error: {e}")

    # Load IPC law database
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        ipc_path = os.path.join(base_dir, "legal", "indian_laws.json")
        with open(ipc_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, list):
            ipc_data = data
            print(f"[OK] Loaded {len(ipc_data)} IPC sections")
        elif isinstance(data, dict):
            ipc_data = [{"section": key, **value} for key, value in data.items()]
            print(f"[OK] Loaded {len(ipc_data)} IPC sections (dict mode)")
        else:
            print("[WARN] IPC data format unknown; skipping load")
    except FileNotFoundError as e:
        print(f"[WARN] Could not load IPC laws (missing): {e}")
    except Exception as e:
        print(f"[WARN] Error reading IPC laws: {e}")

    print("[SUCCESS] EmpathAI backend ready!")


# Request/Response Models
class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to analyze and respond to", min_length=1)


class ChatResponse(BaseModel):
    emotion: str = Field(..., description="Detected emotion")
    harassment: bool = Field(..., description="Whether harassment was detected")
    harassment_confidence: float = Field(..., description="Harassment confidence score (0.0-1.0)")
    reply: str = Field(..., description="AI-generated empathetic response")
    response_time_ms: float = Field(..., description="Response time in milliseconds")


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool


# Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify server and model status."""
    models_loaded = (
        emotion_model is not None and
        harassment_model is not None
    )
    
    return HealthResponse(
        status="healthy" if models_loaded else "degraded",
        models_loaded=models_loaded
    )

@app.get("/api/test-gemini")
async def test_gemini():
    """Test Gemini connection and safety settings."""
    if response_generator is None:
        return {"status": "error", "message": "Response generator not initialized"}
    
    try:
        test_message = "I'm feeling stressed about work"
        reply, web_enabled = response_generator.generate(
            user_message=test_message,
            emotion="anxiety", 
            is_harassment=False,
            harassment_score=0.1
        )
        return {
            "status": "success", 
            "message": "AI Generator is working!",
            "test_response": reply,
            "gemini_active": response_generator.available
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """
    Main chat endpoint that:
    1. Detects emotion in user message
    2. Detects harassment/toxicity
    3. Generates empathetic AI response
    """
    if emotion_model is None or harassment_model is None:
        raise HTTPException(
            status_code=503,
            detail="Models not loaded. Please wait for initialization."
        )
    
    body = await request.json()
    user_message = (body.get("message") or "").strip()
    user_id = body.get("user_id") or "anonymous"
    
    if not user_message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    # Get optional parameters
    enable_web = body.get("enable_web", False)
    
    # Start timing
    start_time = time.time()
    
    try:
        # Step 1: Detect emotion
        emotion_result = emotion_model.detect(user_message)
        detected_emotion = emotion_result.get("emotion", "neutral")
        
        # Step 2: Detect harassment/toxicity
        harassment_result = harassment_model.detect(user_message)
        harassment_score = harassment_result.get("score", 0.0)
        severity_level = harassment_result.get("label", "Low")
        is_harassment = harassment_score >= 0.55

        # Extract keywords separately (if analyze exists)
        keywords = []
        if hasattr(harassment_model, "analyze"):
            try:
                _, keywords = harassment_model.analyze(user_message)
            except Exception:
                keywords = []

        # Step 3: Generate AI response with conversation memory and optional web search
        ai_text = ""
        web_enabled = False

        # Get conversation history for this user (last 6 turns)
        user_history = conversation_history[user_id][-6:] if user_id in conversation_history else []

        if response_generator is not None:
            ai_text, web_enabled = response_generator.generate(
                user_message=user_message,
                emotion=detected_emotion,
                is_harassment=is_harassment,
                harassment_score=harassment_score,
                conversation_history=user_history,
                enable_web=enable_web
            )
        else:
            ai_text = "I'm here to support you. Could you tell me more about how you're feeling? 💜"
        
        # Update conversation history after generating response
        conversation_history[user_id].append(f"User: {user_message}")
        conversation_history[user_id].append(f"EmpathAI: {ai_text}")
        
        # Keep only last 20 turns to prevent memory bloat
        if len(conversation_history[user_id]) > 20:
            conversation_history[user_id] = conversation_history[user_id][-20:]
        
        # Calculate response time
        response_time_ms = (time.time() - start_time) * 1000
        
        # Step 4: Log analytics (emotion, harassment, response time)
        if harassment_logger:
            try:
                harassment_logger.log_analytics(
                    emotion=detected_emotion,
                    harassment_detected=is_harassment,
                    harassment_confidence=harassment_score,
                    response_time_ms=response_time_ms
                )
                
                if is_harassment:
                    harassment_logger.log_incident(
                        severity=harassment_score,
                        emotion=detected_emotion,
                        response_time_ms=response_time_ms,
                        harassment_detected=True
                    )
            except Exception as log_err:
                print(f"[WARN] Incident logging notice: {log_err}")
        
        # Legal reasoning (if harassment Medium/High): match IPC sections by keywords in message
        legal_sections = []
        if (severity_level.lower() in ["medium", "high"] or is_harassment) and ipc_data:
            message_lower = user_message.lower()
            
            # IPC section keywords mapping
            ipc_keywords = {
                "354A": ["sexual", "harassment", "unwelcome", "advances", "favours", "explicit"],
                "354D": ["stalk", "stalking", "follow", "following", "repeatedly"],
                "499": ["defame", "defamation", "reputation", "false", "statement"],
                "503": ["threat", "threaten", "intimidate", "injury", "alarm"],
                "504": ["insult", "provoke", "breach", "peace", "intentionally"],
                "506": ["criminal", "intimidation", "punishment", "kill", "harm"],
                "509": ["modesty", "woman", "word", "gesture", "insult"]
            }
            
            # Check if message matches IPC section keywords
            matched_sections = []
            for section_num, kws in ipc_keywords.items():
                if any(kw in message_lower for kw in kws):
                    if isinstance(ipc_data, list):
                        section_data = next((law for law in ipc_data if law.get("section") == section_num), None)
                    else:
                        section_data = ipc_data.get(section_num)
                    
                    if section_data:
                        if isinstance(section_data, dict):
                            title = section_data.get("title", "")
                            description = section_data.get("description", "")
                            matched_sections.append(f"⚖️ IPC Section {section_num}: {title} — {description}")
            
            legal_sections = matched_sections

        # Log message-level interaction per requirement
        try:
            log_user_interaction(user_id, user_message, emotion_model.predict(user_message), severity_level)
        except Exception:
            pass

        # Step 5: Format response (append IPC laws if relevant and not already in text)
        if legal_sections:
            for section in legal_sections:
                section_num = section.split(":")[0].replace("⚖️ IPC Section", "").replace("⚖️ Suggested IPC", "").strip()
                if section_num not in ai_text:
                    ai_text = f"{ai_text}\n\n{section}"

        # Step 5b: Trigger alert if needed
        if severity_level.lower() in ["medium", "high"]:
            try:
                from utils.notifier import trigger_alert
                trigger_alert(user_id, user_message, severity_level, harassment_score)
            except Exception as alert_error:
                print(f"[WARN] Alert trigger notice: {alert_error}")

        return {
            "reply": ai_text.strip(),
            "emotion": detected_emotion,
            "harassment_level": severity_level,
            "harassment_detected": is_harassment,
            "harassment_confidence": round(harassment_score, 3),
            "keywords": keywords,
            "response_time_ms": round(response_time_ms, 2),
            "web_enabled": web_enabled,
        }
    
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/api/reset")
async def reset_session(request: Request):
    """Reset conversation history for a specific user/session."""
    body = await request.json()
    user_id = body.get("user_id") or "anonymous"
    
    if user_id in conversation_history:
        conversation_history[user_id] = []
        return {"status": "success", "message": f"Conversation history reset for user {user_id}"}
    else:
        return {"status": "success", "message": f"No conversation history found for user {user_id}"}


@app.post("/api/trigger-support")
async def trigger_support_notification(request: Request):
    """
    Trigger supportive message based on detected harassment in notifications.
    Used by notification monitor to provide immediate support.
    """
    if emotion_model is None or harassment_model is None:
        raise HTTPException(
            status_code=503,
            detail="Models not loaded. Please wait for initialization."
        )
    
    body = await request.json()
    message = body.get("message", "").strip()
    severity = body.get("severity", "Low")
    
    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    try:
        # Detect emotion and harassment for the notification message
        emotion_result = emotion_model.detect(message)
        detected_emotion = emotion_result.get("emotion", "distress")
        
        harassment_result = harassment_model.detect(message)
        harassment_score = harassment_result.get("score", 0.0)
        detected_severity = harassment_result.get("label", severity)
        
        # Use the higher severity (from detection or provided)
        severity_map = {"Low": 1, "Medium": 2, "High": 3}
        final_severity = severity
        if severity_map.get(detected_severity, 0) > severity_map.get(severity, 0):
            final_severity = detected_severity
        
        # Generate supportive response
        supportive_text = ""
        if response_generator is not None:
            try:
                ai_text, _ = response_generator.generate(
                    user_message=f"I received a notification that says: {message}",
                    emotion=detected_emotion,
                    is_harassment=True,
                    harassment_score=max(harassment_score, 0.6),
                    conversation_history=None,
                    enable_web=False
                )
                supportive_text = ai_text
            except Exception as e:
                print(f"[WARN] Generation notice, using fallback: {e}")
                supportive_text = get_fallback_support_message(final_severity)
        else:
            supportive_text = get_fallback_support_message(final_severity)
        
        print(f"[NOTIFICATION] Triggered supportive message ({final_severity}): {supportive_text[:60]}...")
        
        return {
            "reply": supportive_text,
            "severity": final_severity,
            "emotion": detected_emotion,
            "harassment_score": round(harassment_score, 3)
        }
        
    except Exception as e:
        print(f"Error in trigger-support: {e}")
        return {
            "reply": get_fallback_support_message(severity),
            "severity": severity,
            "emotion": "distress",
            "harassment_score": 0.0
        }


def get_fallback_support_message(severity: str) -> str:
    """Get fallback supportive message based on severity."""
    if severity == "High":
        return (
            "This sounds extremely serious, and I'm deeply sorry you're going through this. "
            "Please prioritize your safety. You can reach out to authorities (Emergency: 112, Women Helpline: 1091) or trusted friends immediately. "
            "I'm right here with you 💜"
        )
    elif severity == "Medium":
        return (
            "That message sounds really hurtful and unacceptable. I'm here to support you. "
            "You might want to report or block the person involved and keep records of this incident. "
            "You deserve to feel safe and respected 💜"
        )
    else:
        return (
            "I noticed something that might be bothering you. "
            "Please remember, you're not alone — I'm here to listen and help whenever you need 💜"
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
