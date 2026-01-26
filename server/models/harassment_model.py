"""
Harassment/Toxicity Detection Model
Uses unitary/toxic-bert for detecting toxic, harassing, or harmful content.
"""

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict, List, Tuple


class HarassmentModel:
    """Harassment and toxicity detection using Hugging Face pre-trained model."""
    
    MODEL_NAME = "./models/harassment_finetuned"
    
    def __init__(self):
        """Initialize the harassment detection model."""
        print(f"Loading harassment model: {self.MODEL_NAME}")
        
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
        
        # Enhanced keyword list for better detection
        self._harassment_keywords = [
            "abuse", "abusive", "threat", "threaten", "harass", "harassment",
            "violence", "stalk", "stalking", "blackmail", "insult", "touch",
            "sex", "sexual", "explicit", "remarks", "favour", "woman", "modesty",
            "unwanted", "coworker", "colleague", "stop", "intimidat", "forced"
        ]
        
        print(f"Harassment model loaded on {self.device}")
    
    def detect(self, text: str) -> Dict[str, any]:
        """
        Detect harassment/toxicity in text.
        Returns a probability score (0..1) and boolean flag using threshold 0.6.
        """
        if not text or not text.strip():
            return {
                "score": 0.0,
                "is_harassment": False
            }
        
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # ✅ SAFETY PATCH (no behavior change)
        if predictions.shape[1] > 1:
            toxic_score = predictions[0][1].item()
        else:
            toxic_score = predictions[0][0].item()
        
        # Add rule-based heuristic boost for explicit keywords
        text_lower = text.lower()
        explicit_keywords = [
            "sex", "sexual", "harass", "harassment", "molest",
            "explicit", "rape", "stalking", "abuse", "inappropriate", "touch"
        ]
        
        # If any keyword appears, increase the score baseline
        if any(word in text_lower for word in explicit_keywords):
            toxic_score = max(toxic_score, 0.75)
        
        is_harassment = toxic_score > 0.6
        
        return {
            "score": float(toxic_score),
            "is_harassment": is_harassment,
            "label": "Low" if toxic_score < 0.3 else ("Medium" if toxic_score < 0.6 else "High")
        }

    
    def detect_with_keywords(self, text: str) -> dict:
        """Enhanced detection with keyword fallback for obvious cases."""
        model_result = self.detect(text)
        
        strong_harassment_keywords = [
            'sexual', 'explicit', 'harass', 'unwanted', 'coworker', 
            'stop', 'stalking', 'threat', 'intimidat', 'abuse', 'forced'
        ]
        
        message_lower = text.lower()
        keyword_matches = [kw for kw in strong_harassment_keywords if kw in message_lower]
        
        if keyword_matches and model_result["score"] < 0.5:
            return {
                "score": 0.85,
                "is_harassment": True,
                "keywords_matched": keyword_matches
            }
        
        return model_result
    
    def analyze(self, text: str) -> Tuple[str, List[str]]:
        """
        Analyze the text and return (severity_level, keywords).
        """
        detection_result = self.detect_with_keywords(text)
        score = detection_result["score"]
        
        if score < 0.3:
            level = "Low"
        elif score < 0.6:
            level = "Medium"
        else:
            level = "High"
        
        text_lower = (text or "").lower()
        keywords: List[str] = []
        for w in self._harassment_keywords:
            if w in text_lower:
                keywords.append(w)
        
        seen = set()
        keywords = [k for k in keywords if not (k in seen or seen.add(k))]
        return level, keywords
