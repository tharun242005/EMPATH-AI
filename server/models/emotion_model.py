"""
Emotion Detection Model
Uses j-hartmann/emotion-english-distilroberta-base for emotion classification.
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict


class EmotionModel:
    """Emotion detection using Hugging Face pre-trained model."""
    
    MODEL_NAME = "./models/emotion_finetuned"
    
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
    
    def __init__(self):
        """Initialize the emotion detection model."""
        print(f"Loading emotion model: {self.MODEL_NAME}")
        
        # Load tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            self.MODEL_NAME
        )
        
        # Set to evaluation mode
        self.model.eval()
        
        # Use GPU if available, otherwise CPU
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        print(f"Emotion model loaded on {self.device}")
    
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
        anxiety_keywords = ["anxious", "anxiety", "worried", "worry", "nervous", "panic", "stressed", "stress"]
        has_anxiety_keywords = any(keyword in text_lower for keyword in anxiety_keywords)
        
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
        
        # ✅ SAFETY PATCH (no behavior change)
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
        if has_anxiety_keywords and (mapped_emotion == "fear" or mapped_emotion == "neutral"):
            mapped_emotion = "anxiety"
        
        return {
            "emotion": mapped_emotion,
            "confidence": float(confidence),
            "raw_emotion": detected_emotion_label
        }

    def predict(self, text: str) -> str:
        """Convenience API: returns a capitalized emotion label for external callers."""
        result = self.detect(text)
        return result["emotion"].capitalize()
