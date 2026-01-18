# EmpathAI Backend - Google Gemini Setup

## 🚀 Quick Setup with Gemini

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Create `.env` File

Create a `.env` file in the project root (same directory as `server/`):

```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=8000
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- `google-generativeai` - For Gemini API
- `fastapi`, `uvicorn` - For the server
- `transformers`, `torch` - For emotion/harassment detection
- Other required packages

### 4. Run the Server

```bash
cd server
python app.py
```

You should see:
```
🚀 Initializing EmpathAI models...
✅ Emotion model loaded
✅ Harassment model loaded
✅ Google Gemini API enabled
✅ Response generator initialized
✅ Harassment logger initialized
🎉 EmpathAI backend ready!
```

## 📡 API Response Format

The `/api/chat` endpoint now returns:

```json
{
  "emotion": "sadness",
  "harassment": true,
  "harassment_confidence": 0.79,
  "reply": "I'm sorry you're facing this. You deserve to feel safe — here are steps to take if this persists.",
  "response_time_ms": 230
}
```

## 🔄 Fallback Behavior

- **With Gemini API Key**: Uses Gemini for all responses (empathetic, adaptive, India-specific legal guidance)
- **Without Gemini API Key**: Falls back to rule-based empathetic responses (still fully functional)

## 🎯 Features

✅ **Emotion Detection**: 7 emotions (sad, angry, fear, anxiety, happy, calm, neutral)  
✅ **Harassment Detection**: Toxic-bert model with 0.6 threshold  
✅ **Gemini-Powered Responses**: Dynamic, empathetic, context-aware responses  
✅ **Analytics Logging**: Logs emotion, harassment, and response time for all requests  
✅ **India-Specific Legal Guidance**: Gemini provides relevant legal information for Indian users  

## 📊 Analytics

All requests are logged to `server/logs/analytics_logs.json` with:
- Timestamp
- Detected emotion
- Harassment status and confidence
- Response time (ms)

**Privacy**: User messages are NEVER logged, only analytics metadata.

## 🐛 Troubleshooting

### Gemini API Key Not Working
- Verify the key is correct in `.env` file
- Check that `google-generativeai` is installed: `pip install google-generativeai`
- Ensure the API key has proper permissions

### Slow Response Times
- First request may be slower (models loading)
- Gemini API calls typically take 200-500ms
- Check your internet connection

### Fallback to Rule-Based Responses
- If Gemini fails, system automatically uses rule-based responses
- Check console logs for error messages
- Verify API key is valid

---

**Ready to use!** The backend now uses Google Gemini for intelligent, empathetic responses.

