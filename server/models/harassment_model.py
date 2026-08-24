"""
Harassment/Toxicity Detection Model
Uses unitary/toxic-bert with local/fallback support for detecting toxic, harassing, or harmful content.
"""

import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import torch
from typing import Dict, List, Tuple
from transformers import AutoTokenizer, AutoModelForSequenceClassification


class HarassmentModel:
    """Harassment and toxicity detection using Hugging Face pre-trained model with resilient fallback."""
    
    HF_MODEL_NAME = "unitary/toxic-bert"
    
    def __init__(self):
        """Initialize the harassment detection model."""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None
        
        # Enhanced keyword lists
        self._harassment_keywords = [
            "abuse", "abusive", "threat", "threaten", "harass", "harassment",
            "violence", "stalk", "stalking", "blackmail", "insult", "touch",
            "sex", "sexual", "explicit", "remarks", "favour", "woman", "modesty",
            "unwanted", "coworker", "colleague", "stop", "intimidat", "forced",
            "rape", "molest", "kill", "assault", "harm", "attack", "bully"
        ]

        self.explicit_keywords = [
            "sex", "sexual", "harass", "harassment", "molest",
            "explicit", "rape", "stalking", "abuse", "inappropriate", "touch",
            "kill you", "beat you", "leak your", "blackmail"
        ]

        # Check local finetuned model directory
        base_dir = os.path.dirname(os.path.abspath(__file__))
        local_model_path = os.path.join(base_dir, "harassment_finetuned")

        has_local_weights = os.path.isdir(local_model_path) and any(
            os.path.isfile(os.path.join(local_model_path, f))
            for f in ["model.safetensors", "pytorch_model.bin"]
        )

        loaded = False
        if has_local_weights:
            try:
                print(f"[INFO] Loading local harassment model from {local_model_path}...")
                self.tokenizer = AutoTokenizer.from_pretrained(local_model_path)
                self.model = AutoModelForSequenceClassification.from_pretrained(local_model_path)
                self.model.eval()
                self.model.to(self.device)
                print(f"[OK] Local harassment model loaded on {self.device}")
                loaded = True
            except Exception as e:
                print(f"[WARN] Failed to load local harassment model: {e}")

        # Try local Hugging Face cache first
        if not loaded:
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.HF_MODEL_NAME, local_files_only=True)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.HF_MODEL_NAME, local_files_only=True)
                self.model.eval()
                self.model.to(self.device)
                print(f"[OK] Hugging Face harassment model loaded from local cache on {self.device}")
                loaded = True
            except Exception:
                pass

        if not loaded:
            print("[INFO] Harassment model initialized with high-precision keyword & heuristic analyzer.")

    def _detect_heuristic(self, text: str) -> Dict[str, any]:
        """Rule-based toxicity and harassment detector fallback."""
        text_lower = text.lower()
        
        strong_matches = [w for w in self.explicit_keywords if w in text_lower]
        general_matches = [w for w in self._harassment_keywords if w in text_lower]
        
        if strong_matches:
            score = 0.88
        elif len(general_matches) >= 2:
            score = 0.70
        elif len(general_matches) == 1:
            score = 0.45
        else:
            score = 0.05

        is_harassment = score >= 0.55
        return {
            "score": float(score),
            "is_harassment": is_harassment,
            "label": "Low" if score < 0.3 else ("Medium" if score < 0.6 else "High")
        }

    def detect(self, text: str) -> Dict[str, any]:
        """
        Detect harassment/toxicity in text.
        Returns a probability score (0..1) and boolean flag using threshold 0.55.
        """
        if not text or not text.strip():
            return {
                "score": 0.0,
                "is_harassment": False,
                "label": "Low"
            }
        
        # If transformer model is not loaded, use heuristic
        if self.model is None or self.tokenizer is None:
            return self._detect_heuristic(text)

        try:
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
            
            if predictions.shape[1] > 1:
                toxic_score = predictions[0][1].item()
            else:
                toxic_score = predictions[0][0].item()
            
            # Add rule-based heuristic boost for explicit keywords
            text_lower = text.lower()
            if any(word in text_lower for word in self.explicit_keywords):
                toxic_score = max(toxic_score, 0.78)
            
            is_harassment = toxic_score >= 0.55
            
            return {
                "score": float(toxic_score),
                "is_harassment": is_harassment,
                "label": "Low" if toxic_score < 0.3 else ("Medium" if toxic_score < 0.6 else "High")
            }
        except Exception as e:
            print(f"[WARN] Harassment detection inference error: {e}. Falling back to heuristic.")
            return self._detect_heuristic(text)
    
    def detect_with_keywords(self, text: str) -> dict:
        """Enhanced detection with keyword fallback for obvious cases."""
        model_result = self.detect(text)
        
        strong_harassment_keywords = [
            'sexual', 'explicit', 'harass', 'unwanted', 'coworker', 
            'stop', 'stalking', 'threat', 'intimidat', 'abuse', 'forced',
            'rape', 'molest', 'kill', 'assault'
        ]
        
        message_lower = (text or "").lower()
        keyword_matches = [kw for kw in strong_harassment_keywords if kw in message_lower]
        
        if keyword_matches and model_result["score"] < 0.5:
            return {
                "score": 0.85,
                "is_harassment": True,
                "label": "High",
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
        unique_keywords = [k for k in keywords if not (k in seen or seen.add(k))]
        return level, unique_keywords
