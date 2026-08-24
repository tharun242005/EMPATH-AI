"""
AI Response Generator
Generates empathetic, context-aware AI responses using Google Gemini API with intelligent empathetic fallback.
"""

import os
import time
import logging
import random
from typing import Optional, Tuple, List
import requests

logger = logging.getLogger(__name__)

# Try to import google.generativeai safely
try:
    import google.generativeai as genai
    from google.generativeai.types import HarmCategory, HarmBlockThreshold
    GENAI_INSTALLED = True
except ImportError:
    GENAI_INSTALLED = False


class ResponseGenerator:
    """Generates empathetic AI responses using Google Gemini with intelligent empathetic fallback."""
    
    CANDIDATE_MODELS = [
        "gemini-2.5-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-1.5-flash",
        "gemini-pro"
    ]

    def __init__(self):
        """Initialize response generator with Google Gemini client if available."""
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
        configured_model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip()
        self.model_name = configured_model
        self.model = None
        self.available = False

        if GENAI_INSTALLED and self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.model = genai.GenerativeModel(self.model_name)
                self.available = True
                print(f"[OK] Google Gemini API configured -> using {self.model_name}")
            except Exception as e:
                print(f"[WARN] Google Gemini initialization notice: {e}. Intelligent empathetic generator will serve as fallback.")
        else:
            print("[INFO] Gemini API key not active; using built-in intelligent empathetic response generator.")

    def generate(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[List[str]] = None,
        enable_web: bool = False
    ) -> Tuple[str, bool]:
        """
        Generate empathetic AI response.
        Tries Gemini API first if available, and seamlessly falls back to the intelligent empathetic response engine.
        """
        if self.available and self.model is not None:
            try:
                reply, web_enabled = self._generate_gemini_response(
                    user_message=user_message,
                    emotion=emotion,
                    is_harassment=is_harassment,
                    harassment_score=harassment_score,
                    conversation_history=conversation_history,
                    enable_web=enable_web
                )
                if reply and reply.strip():
                    return (reply.strip(), web_enabled)
            except Exception as e:
                logger.warning(f"Gemini API generation failed ({e}). Falling back to empathetic response engine.")

        # Fallback to intelligent empathetic generator
        reply = self._generate_empathetic_response(
            user_message=user_message,
            emotion=emotion,
            is_harassment=is_harassment,
            harassment_score=harassment_score,
            conversation_history=conversation_history
        )
        return (reply, False)

    def _generate_gemini_response(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[List[str]] = None,
        enable_web: bool = False
    ) -> Tuple[str, bool]:
        """Generate response using Google Gemini API."""
        web_enabled = False
        web_context = ""
        
        if enable_web:
            web_keywords = ["today", "latest", "who won", "news", "update", "recent", "current", "what is", "when did"]
            message_lower = user_message.lower()
            if any(keyword in message_lower for keyword in web_keywords):
                web_context = self._fetch_web_context(user_message)
                web_enabled = bool(web_context)

        severity = "Low" if harassment_score < 0.3 else ("Medium" if harassment_score < 0.6 else "High")
        
        history_context = ""
        if conversation_history and len(conversation_history) > 0:
            recent_history = conversation_history[-6:]
            history_context = "\n\nPrevious conversation:\n" + "\n".join(recent_history) + "\n"
        
        web_section = f"\n\n[Live Web Context: {web_context}]" if web_context else ""
        
        prompt = f"""You are EmpathAI, a compassionate, supportive AI companion for emotional support, harassment detection, and legal awareness.
You remember previous conversation context and speak with genuine empathy, warmth, and psychological safety.
{web_section}
{history_context}
User message: "{user_message}"

Context:
- Detected Emotion: {emotion}
- Harassment Detected: {is_harassment}
- Severity: {severity}
- Confidence: {harassment_score:.2f}

Guidelines:
1. Speak in a comforting, human, and validating tone (3-4 sentences).
2. Acknowledge and validate their emotional state.
3. If harassment or threat is detected, prioritize safety, provide clear legal and reporting advice (mention IPC sections if applicable), and share reassurance.
4. If anxious or overwhelmed, suggest a gentle grounding technique or calming thought.
5. Include one warm emoji (e.g. 💜, 🌟, 🛡️, 💙).
"""

        response = self.model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.75,
                max_output_tokens=500,
                top_p=0.9,
            ),
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }
        )
        
        if response and response.text:
            reply_text = response.text.strip()
            for prefix in ["EmpathAI:", "AI:", "Response:"]:
                if reply_text.startswith(prefix):
                    reply_text = reply_text[len(prefix):].strip()
            return (reply_text, web_enabled)
        
        raise ValueError("Empty response from Gemini")

    def _generate_empathetic_response(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[List[str]] = None
    ) -> str:
        """Intelligent, contextual empathetic response generator."""
        msg_lower = (user_message or "").lower()

        # 1. Handle Harassment and Toxic Situations
        if is_harassment or harassment_score >= 0.55:
            if harassment_score >= 0.75 or any(k in msg_lower for k in ["kill", "rape", "assault", "beat", "threat", "blackmail", "leak"]):
                return (
                    "I want you to know that this behavior is completely unacceptable and you do NOT deserve this. "
                    "Your safety and peace of mind are the top priority. Please preserve any messages or evidence (take screenshots), "
                    "and consider reaching out to trusted authorities immediately (Emergency: 112, Women Helpline: 1091, Cyber Crime: 1930). "
                    "I am standing right by your side — you are not alone in this 🛡️💜"
                )
            elif "stalk" in msg_lower or "following" in msg_lower:
                return (
                    "Being stalked or monitored is deeply unsettling and a violation of your privacy and freedom. "
                    "Under Section 354D of the IPC, stalking is a punishable offence. Please tell someone you trust, avoid being alone in isolated areas, "
                    "and document every single incident. I'm here to support you through every step 💜"
                )
            else:
                return (
                    "I hear how uncomfortable and stressful this situation is. Unwanted or harassing behavior should never be tolerated. "
                    "Remember that setting firm boundaries and reporting this person (whether to HR, platforms, or legal authorities) is your right. "
                    "Take a slow breath — I'm right here with you to help you navigate this safely 💜"
                )

        # 2. Handle Emotion Specific Contexts
        if emotion in ["anxiety", "fear"]:
            if any(k in msg_lower for k in ["panic", "can't breathe", "hyperventilating", "overwhelmed"]):
                return (
                    "I hear you, and you are in a safe space right now. Let's take a slow breath together: breathe in slowly for 4 seconds, hold for 4, and gently release for 6. "
                    "You don't have to figure everything out all at once. What is one small thing we can focus on right now? I'm right here with you 💙"
                )
            else:
                return (
                    "It sounds like you're carrying a heavy weight of worry and stress right now. Please give yourself permission to pause and take things one step at a time. "
                    "Whatever is causing this anxiety, your feelings are completely valid. Would you like to share more about what's on your mind? I'm here to listen 🌟"
                )

        elif emotion == "sad":
            if any(k in msg_lower for k in ["lonely", "alone", "nobody"]):
                return (
                    "Feeling alone can be one of the heaviest burdens, but I want to remind you that your presence matters deeply. "
                    "I am here to keep you company and listen without any judgment. You don't have to carry this sadness all by yourself 💜"
                )
            else:
                return (
                    "I'm truly sorry you're feeling down. It takes courage to acknowledge when things feel heavy, and it's okay to not be okay. "
                    "Take gentle care of yourself today. I'm right here to support you whenever you're ready to talk 💙"
                )

        elif emotion == "angry":
            return (
                "It sounds like you've been pushed to your limit, and your anger is completely understandable. "
                "When things feel unfair or frustrating, it helps to let those feelings out in a safe space. "
                "Feel free to vent to me — what triggered this situation? 🧡"
            )

        elif emotion in ["happy", "joy"]:
            return (
                "It's wonderful to hear your positive energy! Seeing you in good spirits brings so much warmth. "
                "What's making you feel this way? I'd love to celebrate with you! ✨😊"
            )

        elif emotion == "calm":
            return (
                "It's really nice to connect with you in this moment of calm. "
                "How has your day been treating you? I'm always here whenever you'd like to chat or reflect 🌿"
            )

        # 3. General empathetic response
        if any(greet in msg_lower for greet in ["hello", "hi", "hey", "good morning", "good evening"]):
            return (
                "Hello! It's so good to see you today. I'm EmpathAI, your supportive companion. "
                "How are you feeling right now? I'm here to listen and help in any way you need 💜"
            )

        return (
            "Thank you for sharing that with me. I'm listening closely and I'm here to support you through whatever you're experiencing. "
            "How can I best help you right now? 💜"
        )

    def _fetch_web_context(self, query: str) -> str:
        """Fetch web context using Google Custom Search API if configured."""
        try:
            google_search_key = os.getenv("GOOGLE_SEARCH_API_KEY")
            google_search_cx = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
            
            if not google_search_key or not google_search_cx:
                return ""
            
            search_url = "https://www.googleapis.com/customsearch/v1"
            params = {"key": google_search_key, "cx": google_search_cx, "q": query, "num": 3}
            response = requests.get(search_url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data and len(data["items"]) > 0:
                snippets = [item.get("snippet", "") for item in data["items"][:3]]
                return " | ".join(snippets)
            return ""
        except Exception as e:
            logger.warning(f"Web search error: {e}")
            return ""

    def test_connection(self):
        """Test Gemini connectivity."""
        if not self.available or self.model is None:
            return "ℹ️ Gemini API not active; Intelligent empathetic engine active."
        try:
            response = self.model.generate_content("Hello! Please respond with just 'OK'.")
            return f"✅ Gemini connection successful: {response.text.strip()}"
        except Exception as e:
            return f"⚠️ Gemini connection notice: {e}. Fallback generator ready."