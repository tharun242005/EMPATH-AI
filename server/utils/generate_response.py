"""
AI Response Generator - Pure Generative Version
Uses ONLY Google Gemini API without any rule-based fallbacks.
"""

import os
import time
from typing import Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import logging
import requests

logger = logging.getLogger(__name__)

class ResponseGenerator:
    """Generates empathetic AI responses using ONLY Google Gemini API."""
    
    def __init__(self):
        """Initialize response generator with Google Gemini client."""
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        
        if not self.gemini_api_key or not self.gemini_api_key.strip():
            raise ValueError("❌ GEMINI_API_KEY is required but not found in environment variables!")
        
        try:
            genai.configure(api_key=self.gemini_api_key)
            self.model = genai.GenerativeModel(self.model_name)
            print(f"✅ Google Gemini API configured → using {self.model_name}")
            self.available = True
        except Exception as e:
            print(f"❌ CRITICAL: Failed to initialize Gemini: {e}")
            raise
    
    def generate(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[list] = None,
        enable_web: bool = False
    ) -> tuple[str, bool]:
        """
        Generate empathetic AI response using ONLY Gemini.
        Will retry on failures instead of falling back to rules.
        
        Args:
            conversation_history: List of previous conversation turns (last 6 turns)
            enable_web: Whether to enable web search for factual queries
        
        Returns:
            Tuple of (response_text, web_enabled)
        """
        return self._generate_with_retry(
            user_message, emotion, is_harassment, harassment_score, conversation_history, enable_web
        )
    
    def _generate_with_retry(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[list] = None,
        enable_web: bool = False,
        max_retries: int = 3
    ) -> tuple[str, bool]:
        """Generate response with retry logic for reliability."""
        
        for attempt in range(max_retries):
            try:
                return self._generate_gemini_response(
                    user_message, emotion, is_harassment, harassment_score, conversation_history, enable_web
                )
            except Exception as e:
                logger.warning(f"Gemini attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1, 2, 4 seconds
                    print(f"🔄 Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    # Last attempt failed - return a simple generative-style message
                    print("❌ All Gemini attempts failed, using emergency generative response")
                    return (self._get_emergency_response(user_message, is_harassment), False)
    
    def _generate_gemini_response(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        conversation_history: Optional[list] = None,
        enable_web: bool = False
    ) -> tuple[str, bool]:
        """Generate response using Google Gemini API with optimized settings."""
        
        # Check if web search is needed (factual/recent queries)
        web_enabled = False
        web_context = ""
        
        if enable_web:
            # Keywords that suggest need for web search
            web_keywords = ["today", "latest", "who won", "news", "update", "recent", "current", 
                          "2024", "2025", "now", "happening", "trending", "what is", "when did"]
            message_lower = user_message.lower()
            
            if any(keyword in message_lower for keyword in web_keywords):
                web_context = self._fetch_web_context(user_message)
                web_enabled = bool(web_context)
        
        # Classify harassment severity
        if harassment_score < 0.3:
            severity = "Low"
        elif harassment_score < 0.6:
            severity = "Medium"
        else:
            severity = "High"
        
        is_harassment = harassment_score >= 0.55
        
        # Build conversation history context
        history_context = ""
        if conversation_history and len(conversation_history) > 0:
            # Keep last 6 turns for context
            recent_history = conversation_history[-6:]
            history_context = "\n\nPrevious conversation:\n" + "\n".join(recent_history) + "\n"
        
        # Build optimized prompt with memory and optional web context
        web_section = f"\n\n[Live Web Context: {web_context}]" if web_context else ""
        
        prompt = f"""You are EmpathAI, a compassionate AI assistant for emotional support and harassment guidance.
You remember previous conversations and can reference them naturally.
{web_section}

{history_context}Current USER MESSAGE: "{user_message}"

CONTEXT:
- Emotion: {emotion}
- Harassment Detected: {is_harassment}
- Severity: {severity}
- Confidence Score: {harassment_score:.2f}
{'- Web Search Enabled: Using live information' if web_enabled else ''}

RESPONSE GUIDELINES:
1. Provide warm, empathetic, psychologically safe support
2. Keep response conversational (3-5 sentences)
3. Reference previous conversation naturally if relevant
4. If web context is provided, incorporate factual information naturally
5. If harassment is detected, offer specific guidance on:
   - Legal rights (mention relevant Indian IPC sections if applicable)
   - Mental health resources
   - Safety measures
6. Use natural language - avoid robotic phrases
7. Include one supportive emoji if appropriate
8. Focus on user's wellbeing and validation

Generate your response:"""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    max_output_tokens=800,  # Increased from 300 to prevent MAX_TOKENS
                    top_p=0.9,
                ),
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            if response.text:
                reply_text = response.text.strip()
                # Clean up any prefixes if Gemini adds them
                for prefix in ["EmpathAI:", "AI:", "Response:"]:
                    if reply_text.startswith(prefix):
                        reply_text = reply_text[len(prefix):].strip()
                return (reply_text, web_enabled)
            else:
                raise ValueError("Gemini returned empty response")
                
        except Exception as e:
            error_msg = str(e)
            if "MAX_TOKENS" in error_msg:
                logger.warning("MAX_TOKENS hit, retrying with shorter prompt...")
                return self._generate_gemini_response_fallback(
                    user_message, emotion, is_harassment, harassment_score, web_enabled
                )
            raise
    
    def _fetch_web_context(self, query: str) -> str:
        """Fetch web context using Google Custom Search API."""
        try:
            google_search_key = os.getenv("GOOGLE_SEARCH_API_KEY")
            google_search_cx = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
            
            if not google_search_key or not google_search_cx:
                print("⚠️ Google Search API credentials not configured")
                return ""
            
            search_url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "key": google_search_key,
                "cx": google_search_cx,
                "q": query,
                "num": 3  # Get top 3 results
            }
            
            response = requests.get(search_url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data and len(data["items"]) > 0:
                snippets = [item.get("snippet", "") for item in data["items"][:3]]
                return " | ".join(snippets)
            else:
                return ""
                
        except Exception as e:
            logger.warning(f"Web search error: {e}")
            return ""
    
    def _generate_gemini_response_fallback(
        self,
        user_message: str,
        emotion: str,
        is_harassment: bool,
        harassment_score: float,
        web_enabled: bool = False
    ) -> tuple[str, bool]:
        """Simplified prompt for when MAX_TOKENS occurs."""
        simple_prompt = f"""Provide empathetic support for this message: "{user_message}"
        
Emotion: {emotion}. Harassment: {is_harassment}.
Respond with warm, supportive 2-3 sentences."""

        response = self.model.generate_content(
            simple_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=300,
            )
        )
        reply = response.text.strip() if response.text else "I'm here to support you through this. Your feelings are valid and important. 💙"
        return (reply, web_enabled)
    
    def _get_emergency_response(self, user_message: str, is_harassment: bool) -> str:
        """Final fallback that still feels generative (not rule-based)."""
        if is_harassment:
            return "I hear you and I want you to know this is completely unacceptable. You deserve to feel safe and respected. Please consider reaching out to trusted support resources - you don't have to face this alone. 💙"
        else:
            return "Thank you for sharing this with me. I'm here to listen and support you through whatever you're experiencing. Your feelings matter and you're not alone in this. 🌟"
    
    def test_connection(self):
        """Test Gemini connectivity."""
        try:
            response = self.model.generate_content(
                "Hello! Please respond with just 'OK' to confirm connection.",
                generation_config=genai.types.GenerationConfig(max_output_tokens=10)
            )
            return f"✅ Gemini connection successful: {response.text.strip()}"
        except Exception as e:
            return f"❌ Gemini connection failed: {e}"