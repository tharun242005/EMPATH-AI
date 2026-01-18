# EmpathAI Backend

FastAPI backend server for EmpathAI - an emotional, mental, and legal support companion.

## Features

- **Emotion Detection**: Uses `j-hartmann/emotion-english-distilroberta-base` to detect emotions (sad, angry, fear, anxiety, happy, calm, neutral)
- **Harassment Detection**: Uses `unitary/toxic-bert` to detect toxic/harassing content
- **AI Response Generation**: Generates empathetic responses with optional OpenAI GPT-4 fallback
- **Incident Logging**: Logs harassment incidents (severity only, not user text) for monitoring

## Installation

1. **Install Python 3.11+** (if not already installed)

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables** (optional):
```bash
# Create .env file in project root
OPENAI_API_KEY=your_openai_api_key_here  # Optional: for GPT-4 fallback
PORT=8000  # Optional: default is 8000
```

## Running the Server

### Option 1: Direct Python execution
```bash
cd server
python app.py
```

### Option 2: Using uvicorn directly
```bash
cd server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at: **http://localhost:8000**

## API Endpoints

### POST `/api/chat`

Main chat endpoint that analyzes messages and generates responses.

**Request:**
```json
{
  "message": "I'm feeling really anxious today"
}
```

**Response:**
```json
{
  "emotion": "anxiety",
  "harassment": "false",
  "confidence": 0.85,
  "aiResponse": "I can feel the anxiety in your message. Anxiety can be overwhelming, but remember, you're not alone. Would it help to talk about what's making you feel anxious? I'm here to listen and support you through this."
}
```

### GET `/health`

Health check endpoint to verify server and model status.

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

## Model Behavior

### Harassment Detection
- **Threshold**: Score > 0.6 is considered harassment
- **Response**: When harassment is detected, the AI provides legal help guidance
- **Logging**: Incidents are logged (severity and emotion only, not user text)

### Emotion-Based Responses
- **Negative emotions** (sad, angry, fear, anxiety): Empathetic, supportive responses
- **Neutral/calm emotions**: General conversational responses
- **Happy emotions**: Positive, supportive responses

### OpenAI Fallback
- If `OPENAI_API_KEY` is set in `.env`, the system uses GPT-4 for more nuanced responses
- If not set, uses rule-based empathetic responses
- Automatically falls back to rule-based if OpenAI API fails

## Project Structure

```
server/
├── app.py                    # Main FastAPI application
├── models/
│   ├── emotion_model.py      # Emotion detection model
│   └── harassment_model.py   # Harassment detection model
└── utils/
    ├── generate_response.py  # AI response generation
    └── logger.py             # Harassment incident logging
```

## CORS Configuration

The server is configured to allow requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)

To add more origins, edit `app.py` and add to the `allow_origins` list in CORS middleware.

## Performance

- Models are loaded once at startup and cached in memory
- First request may be slower as models initialize
- Subsequent requests are fast (~100-500ms depending on hardware)
- GPU acceleration is automatically used if available

## Troubleshooting

### Models not loading
- Ensure you have internet connection (models download from Hugging Face on first run)
- Check that you have sufficient disk space (~500MB for models)
- Verify Python 3.11+ is installed

### OpenAI fallback not working
- Check that `OPENAI_API_KEY` is set correctly in `.env`
- Verify the API key is valid
- Check that `openai` package is installed: `pip install openai`

### Port already in use
- Change the port in `.env` file: `PORT=8001`
- Or kill the process using port 8000

## Development

To run in development mode with auto-reload:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## License

Part of the EmpathAI project.

