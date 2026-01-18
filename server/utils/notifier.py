import datetime


def trigger_alert(user_id: str, message: str, severity: str, score: float) -> None:
    """Console-based alert hook for Medium/High harassment events."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(
        """
🚨 ALERT: Harassment Detected!
🧍 User: {user_id}
🧩 Severity: {severity} ({score:.2f})
💬 Message: {message}
⏰ Time: {timestamp}
""".format(
            user_id=user_id,
            severity=severity,
            score=score,
            message=message,
            timestamp=timestamp,
        )
    )
