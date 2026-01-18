# EmpathAI Backend - Quick Start Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: First-time installation may take a few minutes as it downloads:
- PyTorch (~2GB)
- Hugging Face models (~500MB total)

### 2. (Optional) Set Up OpenAI API Key

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

If you don't provide an API key, the system will use rule-based empathetic responses (still fully functional).

### 3. Run the Server

```bash
cd server
python app.py
```

The server will start at **http://localhost:8000**

You should see:
```
🚀 Initializing EmpathAI models...
✅ Emotion model loaded
✅ Harassment model loaded
✅ Response generator initialized
✅ Harassment logger initialized
🎉 EmpathAI backend ready!
```

## 📡 Testing the API

### Test Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am feeling really anxious today"}'
```

Expected response:
```json
{
  "emotion": "anxiety",
  "harassment": "false",
  "confidence": 0.85,
  "aiResponse": "I can feel the anxiety in your message. Anxiety can be overwhelming, but remember, you're not alone. Would it help to talk about what's making you feel anxious? I'm here to listen and support you through this."
}
```

## 🔌 Frontend Integration

Update your React frontend to use the new backend:

**In `src/pages/Chat.tsx`**, replace the Supabase endpoints with:

```typescript
// Replace the analyze and respond calls with a single chat call
const chatResponse = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: inputMessage,
  }),
});

const data = await chatResponse.json();

// Use the response
setCurrentEmotion(data.emotion);
const aiMessage: Message = {
  id: (Date.now() + 1).toString(),
  text: data.aiResponse,
  isUser: false,
  timestamp: new Date().toISOString(),
  emotion: data.emotion,
};

// Check for harassment
if (data.harassment === "true") {
  setShowLegalHelp(true);
}
```

## 📊 Response Format

The `/api/chat` endpoint returns:

```json
{
  "emotion": "sadness" | "anger" | "fear" | "anxiety" | "happy" | "calm" | "neutral",
  "harassment": "true" | "false",
  "confidence": 0.0-1.0,
  "aiResponse": "Generated empathetic response text"
}
```

## 🎯 Features

- ✅ Emotion detection (7 emotions)
- ✅ Harassment/toxicity detection (threshold: 0.6)
- ✅ Empathetic response generation
- ✅ Optional GPT-4 fallback
- ✅ Harassment incident logging (privacy-preserving)
- ✅ CORS enabled for frontend
- ✅ Model caching for performance

## 🐛 Troubleshooting

### Models taking too long to load
- First run downloads models from Hugging Face (~500MB)
- Subsequent runs are much faster (models cached locally)
- Check internet connection

### Port 8000 already in use
- Change port in `.env`: `PORT=8001`
- Or kill the process: `netstat -ano | findstr :8000` (Windows)

### OpenAI fallback not working
- Verify API key in `.env` file
- Check API key is valid
- Ensure `openai` package installed: `pip install openai`

### CORS errors from frontend
- Verify frontend origin is in `app.py` CORS settings
- Default allows: `localhost:3000` and `localhost:5173`

## 📁 Project Structure

```
server/
├── app.py                    # Main FastAPI application
├── models/
│   ├── emotion_model.py      # Emotion detection
│   └── harassment_model.py   # Harassment detection
└── utils/
    ├── generate_response.py  # AI response generation
    └── logger.py             # Incident logging
```

## 🔒 Privacy & Security

- **No message storage**: User messages are processed in real-time, never saved
- **Harassment logging**: Only logs severity and emotion, NOT user text
- **Local processing**: All ML models run locally (except optional OpenAI)
- **HTTPS ready**: Configure reverse proxy (nginx) for production

## 🚀 Production Deployment

For production, consider:
1. Use a process manager (PM2, systemd)
2. Set up reverse proxy (nginx)
3. Enable HTTPS
4. Configure environment variables securely
5. Set up monitoring and logging

Example with uvicorn workers:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

---

**Ready to use!** The backend is now fully functional and ready to connect to your React frontend.

