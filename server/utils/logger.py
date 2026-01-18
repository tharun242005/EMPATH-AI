"""
Analytics Logger
Logs emotion analysis, harassment detection, and response times for analytics.
Logs severity and emotional tone (not user text) for monitoring.
"""

import os
import json
from datetime import datetime
from typing import Optional
from pathlib import Path
from datetime import datetime


class HarassmentLogger:
    """Logs emotion analysis, harassment incidents, and response metrics for analytics."""
    
    def __init__(self, log_file: Optional[str] = None):
        """
        Initialize logger.
        
        Args:
            log_file: Optional path to log file. Defaults to 'harassment_logs.json' in server directory.
        """
        if log_file is None:
            # Default to server/logs/analytics_logs.json
            log_dir = Path(__file__).parent.parent / "logs"
            log_dir.mkdir(exist_ok=True)
            log_file = str(log_dir / "analytics_logs.json")
        
        self.log_file = log_file
        self._ensure_log_file()
    
    def _ensure_log_file(self):
        """Ensure log file exists with proper structure."""
        if not os.path.exists(self.log_file):
            with open(self.log_file, 'w') as f:
                json.dump({
                    "incidents": [],
                    "analytics": []
                }, f, indent=2)
    
    def log_incident(
        self,
        severity: float,
        emotion: str,
        response_time_ms: Optional[float] = None,
        harassment_detected: bool = False
    ):
        """
        Log a harassment incident with analytics.
        
        Args:
            severity: Harassment score (0.0-1.0)
            emotion: Detected emotion at time of incident
            response_time_ms: Response time in milliseconds (optional)
            harassment_detected: Whether harassment was detected (optional)
        """
        incident = {
            "timestamp": datetime.utcnow().isoformat(),
            "severity": round(severity, 3),
            "emotion": emotion,
            "harassment_detected": harassment_detected,
            # Note: We do NOT log the user message for privacy
        }
        
        if response_time_ms is not None:
            incident["response_time_ms"] = round(response_time_ms, 2)
        
        try:
            # Read existing logs
            with open(self.log_file, 'r') as f:
                data = json.load(f)
            
            # Append new incident
            if "incidents" not in data:
                data["incidents"] = []
            data["incidents"].append(incident)
            
            # Keep only last 1000 incidents to prevent file from growing too large
            if len(data["incidents"]) > 1000:
                data["incidents"] = data["incidents"][-1000:]
            
            # Write back
            with open(self.log_file, 'w') as f:
                json.dump(data, f, indent=2)
        
        except Exception as e:
            print(f"Error logging incident: {e}")
            # Non-critical error, don't fail the request
    
    def log_analytics(
        self,
        emotion: str,
        harassment_detected: bool,
        harassment_confidence: float,
        response_time_ms: float
    ):
        """
        Log analytics data for each request (emotion, harassment, response time).
        
        Args:
            emotion: Detected emotion
            harassment_detected: Whether harassment was detected
            harassment_confidence: Harassment confidence score (0.0-1.0)
            response_time_ms: Response time in milliseconds
        """
        analytics_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "emotion": emotion,
            "harassment_detected": harassment_detected,
            "harassment_confidence": round(harassment_confidence, 3),
            "response_time_ms": round(response_time_ms, 2),
            # Note: We do NOT log the user message for privacy
        }
        
        try:
            # Read existing logs
            with open(self.log_file, 'r') as f:
                data = json.load(f)
            
            # Append analytics entry
            if "analytics" not in data:
                data["analytics"] = []
            data["analytics"].append(analytics_entry)
            
            # Keep only last 5000 analytics entries
            if len(data["analytics"]) > 5000:
                data["analytics"] = data["analytics"][-5000:]
            
            # Write back
            with open(self.log_file, 'w') as f:
                json.dump(data, f, indent=2)
        
        except Exception as e:
            print(f"Error logging analytics: {e}")
            # Non-critical error, don't fail the request
    
    def get_stats(self) -> dict:
        """
        Get statistics about logged incidents.
        
        Returns:
            Dictionary with incident statistics
        """
        try:
            with open(self.log_file, 'r') as f:
                data = json.load(f)
            
            incidents = data.get("incidents", [])
            
            if not incidents:
                return {
                    "total_incidents": 0,
                    "average_severity": 0.0,
                    "most_common_emotion": None
                }
            
            total = len(incidents)
            avg_severity = sum(i["severity"] for i in incidents) / total
            
            # Count emotions
            emotion_counts = {}
            for incident in incidents:
                emotion = incident.get("emotion", "unknown")
                emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            
            most_common_emotion = max(emotion_counts.items(), key=lambda x: x[1])[0] if emotion_counts else None
            
            return {
                "total_incidents": total,
                "average_severity": round(avg_severity, 3),
                "most_common_emotion": most_common_emotion,
                "emotion_distribution": emotion_counts
            }
        
        except Exception as e:
            print(f"Error getting stats: {e}")
            return {"error": str(e)}


def log_user_interaction(user_id: str, message: str, emotion: str, harassment_level: str) -> None:
    """Append a single line interaction log including the original message (per requirement)."""
    try:
        log_dir = Path(__file__).parent.parent / "logs"
        log_dir.mkdir(exist_ok=True)
        log_file = log_dir / "interactions.log"
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(
                f"[{timestamp}] User: {user_id} | Emotion: {emotion} | Harassment: {harassment_level} | Message: {message}\n"
            )
    except Exception as e:
        print(f"Error writing interaction log: {e}")

