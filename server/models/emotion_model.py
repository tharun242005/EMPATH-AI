"""
Emotion Detection Model
Uses j-hartmann/emotion-english-distilroberta-base with local/fallback support for emotion classification.
"""

import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import torch
from typing import Dict
from transformers import AutoTokenizer, AutoModelForSequenceClassification


class EmotionModel:
    """Emotion detection using Hugging Face pre-trained model with robust fallback."""
    
    HF_MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"
    
    # Emotion labels from the model
    EMOTION_LABELS = [
        "joy",
        "sadness",
        "anger",
        "fear",
        "surprise",
        "disgust",
        "neutral"
    ]
    
    # Map model emotions to our system emotions
    EMOTION_MAPPING = {
        "joy": "happy",
        "sadness": "sad",
        "anger": "angry",
        "fear": "fear",
        "surprise": "calm",
        "disgust": "angry",
        "neutral": "neutral"
    }

    # Keyword lexicons for keyword-based fallback or heuristic adjustments
    EMOTION_KEYWORDS = {
        "happy": ["happy", "joy", "excited", "grateful", "glad", "wonderful", "great", "awesome", "delighted", "blessed", "cheerful"],
        "sad": ["sad", "depressed", "unhappy", "crying", "heartbroken", "lonely", "grief", "hopeless", "miserable", "down", "sorrow"],
        "angry": ["angry", "furious", "mad", "rage", "irritated", "annoyed", "frustrated", "hate", "pissed", "outrage"],
        "fear": ["scared", "afraid", "terrified", "fear", "frightened", "panic", "dread", "horror", "alarmed"],
        "anxiety": ["anxious", "anxiety", "worried", "worry", "nervous", "panic", "stressed", "stress", "overwhelmed", "uneasy"],
        "calm": ["calm", "relaxed", "peaceful", "fine", "okay", "alright", "chill", "serene", "tranquil"]
    }
    
    def __init__(self):
        """Initialize the emotion detection model."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None

        # Check local finetuned model directory
        base_dir = os.path.dirname(os.path.abspath(__file__))
        local_model_path = os.path.join(base_dir, "emotion_finetuned")
        
        has_local_weights = os.path.isdir(local_model_path) and any(
            os.path.isfile(os.path.join(local_model_path, f)) 
            for f in ["model.safetensors", "pytorch_model.bin"]
        )

        loaded = False
        if has_local_weights:
            try:
                print(f"[INFO] Loading local emotion model from {local_model_path}...")
                self.tokenizer = AutoTokenizer.from_pretrained(local_model_path)
                self.model = AutoModelForSequenceClassification.from_pretrained(local_model_path)
                self.model.eval()
                self.model.to(self.device)
                print(f"[OK] Local emotion model loaded on {self.device}")
                loaded = True
            except Exception as e:
                print(f"[WARN] Failed to load local emotion model: {e}")

        # 1. Try local cache first for instant boot
        if not loaded:
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.HF_MODEL_NAME, local_files_only=True)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.HF_MODEL_NAME, local_files_only=True)
                self.model.eval()
                self.model.to(self.device)
                print(f"[OK] Hugging Face emotion model loaded from local cache on {self.device}")
                loaded = True
            except Exception:
                pass

        # 2. Try online download if not in local cache
        if not loaded:
            try:
                print(f"[INFO] Loading Hugging Face emotion model: {self.HF_MODEL_NAME}...")
                self.tokenizer = AutoTokenizer.from_pretrained(self.HF_MODEL_NAME)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.HF_MODEL_NAME)
                self.model.eval()
                self.model.to(self.device)
                print(f"[OK] Hugging Face emotion model loaded on {self.device}")
                loaded = True
            except Exception as e:
                print(f"[WARN] Could not load Hugging Face emotion model ({e}). Using heuristic emotion detector.")

    def _detect_heuristic(self, text: str) -> Dict[str, any]:
        """Heuristic rule-based emotion detection fallback."""
        text_lower = text.lower()
        matched_scores = {}
        for emotion, kws in self.EMOTION_KEYWORDS.items():
            count = sum(1 for kw in kws if kw in text_lower)
            if count > 0:
                matched_scores[emotion] = count

        if matched_scores:
            top_emotion = max(matched_scores, key=matched_scores.get)
            return {
                "emotion": top_emotion,
                "confidence": min(0.65 + 0.1 * matched_scores[top_emotion], 0.95),
                "raw_emotion": top_emotion
            }
        
        return {
            "emotion": "neutral",
            "confidence": 0.5,
            "raw_emotion": "neutral"
        }
    
    def detect(self, text: str) -> Dict[str, any]:
        """
        Detect emotion in text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary with 'emotion' and 'confidence' keys
        """
        if not text or not text.strip():
            return {
                "emotion": "neutral",
                "confidence": 0.0
            }
        
        # Check for anxiety keywords (since model doesn't have anxiety label)
        text_lower = text.lower()
        anxiety_keywords = ["anxious", "anxiety", "worried", "worry", "nervous", "panic", "stressed", "stress", "overwhelmed"]
        has_anxiety_keywords = any(keyword in text_lower for keyword in anxiety_keywords)
        
        # If transformer model is not loaded, use heuristic
        if self.model is None or self.tokenizer is None:
            return self._detect_heuristic(text)

        try:
            # Tokenize input
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
            top_prediction = torch.argmax(predictions, dim=-1).item()
            
            if top_prediction < len(self.EMOTION_LABELS):
                confidence = predictions[0][top_prediction].item()
                detected_emotion_label = self.EMOTION_LABELS[top_prediction]
            else:
                confidence = float(torch.max(predictions).item())
                detected_emotion_label = "neutral"
            
            # Map to our emotion system
            mapped_emotion = self.EMOTION_MAPPING.get(
                detected_emotion_label,
                "neutral"
            )
            
            # Override with anxiety if anxiety keywords detected and emotion is fear or neutral
            if has_anxiety_keywords and (mapped_emotion in ["fear", "neutral", "sad"]):
                mapped_emotion = "anxiety"
            
            return {
                "emotion": mapped_emotion,
                "confidence": float(confidence),
                "raw_emotion": detected_emotion_label
            }
        except Exception as e:
            print(f"[WARN] Emotion detection inference error: {e}. Falling back to heuristic.")
            return self._detect_heuristic(text)

    def predict(self, text: str) -> str:
        """Convenience API: returns a capitalized emotion label for external callers."""
        result = self.detect(text)
        return result["emotion"].capitalize()
