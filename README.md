# EmpathAI — Proactive Emotional, Mental, and Legal Support Companion

EmpathAI is a React + TypeScript web application with cross-platform desktop (Electron) and mobile (React Native) capabilities for proactive emotional support, harassment detection, and legal guidance. It helps users navigate distressing situations by providing empathetic AI responses, detecting harassment in real-time, and offering Indian Penal Code (IPC) legal resources. The platform features beautiful animations, voice assistance, session-based chat persistence, and cross-platform notification monitoring.

---

## Local Development

**WEBSITE URL**: https://empath--ai.web.app/

The application runs locally with Vite development server for the frontend and FastAPI for the backend. Desktop and mobile apps are available for Windows and Android respectively.

---

## Tech Stack

- **React + TypeScript** (frontend UI with componentized architecture)
- **Vite** (fast development server and optimized builds)
- **FastAPI** (Python backend with emotion and harassment detection)
- **Google Gemini API** (AI-powered empathetic response generation)
- **Framer Motion** (`motion` for smooth UI animations and transitions)
- **Tailwind CSS** (utility-first responsive styling)
- **Radix UI** (accessible component primitives)
- **Supabase** (authentication and optional database features)
- **Electron** (Windows desktop application with notification bridge)
- **React Native** (Android mobile application with NotificationListenerService)
- **Transformers (Hugging Face)** (emotion detection: `j-hartmann/emotion-english-distilroberta-base`, harassment detection: `unitary/toxic-bert`)

---

## Features

### Core Functionality

- **Emotion Detection** – Identifies 9 emotion types: happy, sad, angry, anxious, fearful, hopeful, calm, distressed, neutral
- **Harassment Detection** – Real-time toxic content detection with severity scoring (Low, Medium, High)
- **AI-Powered Responses** – Gemini 2.5 Flash integration for context-aware, empathetic conversations
- **Legal Resources** – Indian Penal Code (IPC) sections, complaint templates, and helpline information
- **Session Management** – ChatGPT-like chat history with multiple conversations stored locally
- **Voice Assistant** – Speech-to-text input and text-to-speech output with visual feedback
- **Notification Monitoring** – Cross-platform proactive support for Windows Desktop and Android Mobile
- **Memory Retention** – Backend conversation history for context-aware follow-up responses
- **Privacy-First** – Local chat storage, no message logging, secure authentication

### UI/UX Features

- **Animated Dashboard** – Beautiful animations using Framer Motion with smooth transitions
- **3D Visualizations** – React Three Fiber powered 3D heart animations and particle effects
- **Glassmorphism Design** – Modern depth effects with backdrop blur and shadows
- **Emotion-Based Themes** – Dynamic background gradients that adapt to detected emotions
- **Responsive Design** – Mobile-first design that adapts to all screen sizes
- **Real-Time Updates** – Instant UI updates when sending messages or receiving responses
- **Loading States** – Animated loaders and typing indicators for better user experience
- **Toast Notifications** – User feedback via Sonner toast notifications
- **Dark/Light Mode** – Theme switching with next-themes

### Cross-Platform Features

- **Windows Desktop App** – Electron application with Windows notification bridge (UWP via C#)
- **Android Mobile App** – React Native app with Kotlin NotificationListenerService
- **Proactive Notifications** – Detects harassment in OS notifications and triggers supportive responses
- **Deep Linking** – Pre-filled chat messages when opening from notification alerts
- **Auto-Start** – Windows app auto-launches on login for continuous protection

### Data Visualization

- **Chat History** – Sidebar with session list, date grouping, and quick access
- **Emotion Indicators** – Visual badges and particles that reflect emotional state
- **Severity Alerts** – Pulse glow effects for high-severity harassment detection
- **Legal Resource Browser** – Searchable IPC sections with clickable references in messages

---

## Getting Started

### Prerequisites

- **Node.js LTS** (v18 or higher recommended) and npm installed:

```bash
node -v
npm -v
```

- **Python 3.11+** and pip installed:

```bash
python --version
pip --version
```

- **Google Gemini API Key** – Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository** or navigate to the project directory:

```bash
cd "EmpathAI Phase 4 Enhancements"
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Install backend dependencies:**

```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**

   Create a `.env` file in the project root (same directory as `server/`):

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

   For Supabase authentication (optional), update `src/utils/supabase/info.tsx` with your project details.

5. **Start the backend server:**

```bash
cd server
python app.py
```

The backend will start at `http://localhost:8000`.

6. **Start the frontend development server:**

```bash
npm run dev
```

Vite will start the development server at `http://localhost:3000`. Open it in your browser.

7. **Build for production:**

```bash
npm run build
```

The build output will be in the `build/` directory, ready for deployment.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Google Gemini API Key (required for AI responses)
GEMINI_API_KEY=your_gemini_api_key_here

# Backend server port (optional, defaults to 8000)
PORT=8000
```

**Security Notes:**

- Never commit actual keys to version control
- Use environment variables or secure configuration for sensitive data
- Restrict API keys appropriately in Google AI Studio dashboard

---

## Project Structure

```
EmpathAI Phase 4 Enhancements/
├── src/
│   ├── App.tsx                      # Main application component and routing
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles
│   ├── components/
│   │   ├── ConsentModal.tsx         # Privacy consent dialog
│   │   ├── EmotionBadge.tsx         # Emotion display component
│   │   ├── EmotionParticles.tsx     # Animated particle effects
│   │   ├── FloatingOrbs.tsx         # Background floating elements
│   │   ├── Heart3D.tsx              # 3D heart visualization
│   │   ├── MessageBubble.tsx        # Chat message component
│   │   ├── MessageRipple.tsx        # Ripple animation effects
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── Footer.tsx               # Footer component
│   │   ├── ParticleWaves.tsx        # Background particle waves
│   │   ├── SendButton.tsx           # Send button with animations
│   │   ├── TypingIndicator.tsx      # AI typing indicator
│   │   ├── VoiceAssistant.tsx       # Voice input/output component
│   │   └── ui/                      # Reusable UI components (Radix UI)
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page with hero section
│   │   ├── Chat.tsx                 # Main chat interface
│   │   ├── Legal.tsx                # Legal resources and IPC sections
│   │   ├── Settings.tsx             # User settings page
│   │   ├── Login.tsx                # User login component
│   │   ├── Signup.tsx               # User registration component
│   │   ├── PrivacyPolicy.tsx        # Privacy policy page
│   │   ├── TermsConditions.tsx      # Terms of service page
│   │   └── ResetPassword.tsx        # Password reset page
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context provider
│   ├── utils/
│   │   ├── chatStorage.ts           # Local chat session management
│   │   ├── notificationMonitor.ts   # Browser notification monitoring
│   │   └── supabase/
│   │       └── info.tsx             # Supabase configuration
│   ├── lib/
│   │   └── supabase.ts              # Supabase client setup
│   └── styles/
│       └── globals.css              # Global styles and theme
├── server/
│   ├── app.py                       # Main FastAPI application
│   ├── models/
│   │   ├── emotion_model.py         # Emotion detection model
│   │   └── harassment_model.py      # Harassment detection model
│   ├── utils/
│   │   ├── generate_response.py     # AI response generation
│   │   ├── logger.py                # Analytics and incident logging
│   │   └── notifier.py              # Notification utilities
│   ├── legal/
│   │   └── indian_laws.json         # IPC sections and legal data
│   └── logs/
│       ├── analytics_logs.json      # Analytics logs
│       └── interactions.log         # Interaction logs
├── desktop/                         # Electron desktop application
│   ├── src/
│   │   ├── main.ts                  # Main Electron process
│   │   ├── win-notifications.ts     # Windows notification bridge
│   │   └── dev.ts                   # Development runner
│   ├── winbridge/                   # Windows notification bridge DLL location
│   ├── package.json                 # Electron app dependencies
│   └── README.md                    # Desktop app setup guide
├── mobile/                          # React Native mobile application
│   ├── android/
│   │   └── app/src/main/java/com/empathaimobile/notifications/
│   │       └── EmpathNotificationService.kt  # Android notification listener
│   ├── App.tsx                      # React Native app entry
│   ├── package.json                 # React Native dependencies
│   └── README.md                    # Mobile app setup guide
├── shared/                          # Shared TypeScript code
│   ├── harassment.ts                # Harassment severity detection logic
│   └── backend.ts                   # Backend API client utilities
├── WinBridge/                       # C# UWP notification bridge
│   ├── NotificationBridge.cs        # C# notification listener
│   └── EmpathAI.WinBridge.csproj    # C# project file
├── build/                           # Production build output
├── public/
│   ├── icon.png                     # App icon
│   ├── favicon.ico                  # Browser favicon
│   └── service-worker.js            # Service worker for notifications
├── package.json                     # Project dependencies and scripts
├── vite.config.ts                   # Vite configuration
├── requirements.txt                 # Python backend dependencies
├── firebase.json                    # Firebase Hosting configuration (optional)
└── README.md                        # This file
```

---

## Key Features Deep Dive

### Emotion Detection

- **9 Emotion Types** – Comprehensive emotion classification using Hugging Face transformers
- **Real-Time Analysis** – Instant emotion detection on message submission
- **Visual Feedback** – Emotion badges and animated particles that reflect emotional state
- **Context Awareness** – Backend memory retention for emotion-aware follow-up responses

### Harassment Detection

- **Severity Levels** – Low, Medium, High classification based on keyword detection and ML models
- **Toxic Content Detection** – Uses `unitary/toxic-bert` model for toxic content identification
- **Proactive Alerts** – Cross-platform notification monitoring triggers supportive responses
- **Legal Guidance** – Automatic IPC section references for Medium/High severity cases
- **Privacy Protection** – Only severity and emotion logged, never user message content

### AI Response Generation

- **Gemini 2.5 Flash** – Google's advanced AI model for empathetic, context-aware responses
- **Memory Retention** – Backend conversation history (last 6 turns) for intelligent follow-ups
- **Emotion Integration** – Responses tailored to detected emotional state
- **Legal Context** – IPC references and legal guidance integrated into responses
- **Fallback Support** – Rule-based empathetic responses if Gemini API unavailable

### Chat Management

- **Session-Based Storage** – Multiple chat conversations like ChatGPT sidebar
- **Local Persistence** – All chats stored in browser localStorage, persisting after refresh
- **Date Grouping** – Conversations organized by date for easy navigation
- **Session Titles** – Auto-generated titles from first message
- **Quick Access** – Sidebar with session list, search, and management

### Cross-Platform Notification Monitoring

- **Windows Desktop** – Electron app with C# UWP bridge reading Windows notifications
- **Android Mobile** – React Native app with Kotlin NotificationListenerService
- **Proactive Detection** – Monitors OS notifications for harassment keywords
- **Supportive Responses** – Triggers local notifications with deep links to chat
- **Backend Integration** – Sends alerts to `/api/trigger-support` endpoint for centralized logging

---

## API Endpoints

### POST `/api/chat`

Main chat endpoint that analyzes messages and generates empathetic responses.

**Request:**
```json
{
  "message": "I'm feeling really anxious today",
  "user_id": "user123"
}
```

**Response:**
```json
{
  "emotion": "anxiety",
  "harassment": false,
  "harassment_level": "Low",
  "severity": 2,
  "reply": "I can feel the anxiety in your message. Anxiety can be overwhelming, but remember, you're not alone. Would it help to talk about what's making you feel anxious? I'm here to listen and support you through this.",
  "response_time_ms": 230,
  "ipc_sections": []
}
```

### POST `/api/trigger-support`

Proactive support endpoint triggered by notification monitoring services.

**Request:**
```json
{
  "source": "windows",
  "title": "WhatsApp",
  "message": "Someone is threatening me",
  "severity": "High",
  "user_id": "user123",
  "hits": ["threat"]
}
```

**Response:**
```json
{
  "status": "success",
  "support_message": "Hey, I noticed something distressing. I'm here for you 💜"
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

---

## Scripts

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR on port 3000 |
| `npm run build` | Create optimized production bundle in `build/` |

### Backend Scripts

| Command | Description |
|---------|-------------|
| `cd server && python app.py` | Start FastAPI server on port 8000 |
| `cd server && uvicorn app:app --reload` | Start server with auto-reload |

---

## Desktop Application (Windows)

### Building the Desktop App

1. **Build the C# WinBridge:**

   - Open `WinBridge/EmpathAI.WinBridge.csproj` in Visual Studio 2022
   - Set configuration to **Debug x64**
   - Build the project
   - Copy output DLLs from `WinBridge/bin/x64/Debug/` to `desktop/winbridge/`

2. **Install Electron dependencies:**

```bash
cd desktop
npm install
npm install electron-edge-js --legacy-peer-deps
```

3. **Run in development:**

```bash
npm run dev
```

4. **Build installable `.exe`:**

```bash
npm run build
npx electron-builder --win --x64
```

For detailed setup, see `desktop/README.md`.

---

## Mobile Application (Android)

### Setting Up Android App

1. **Install React Native dependencies:**

```bash
cd mobile
npm install
```

2. **Configure Android:**

   - Ensure `AndroidManifest.xml` has notification permissions
   - Grant notification listener permission in Android settings
   - Configure `gradle.properties` with Java home path

3. **Run on Android:**

```bash
npx react-native run-android
```

For detailed setup, see `mobile/README.md`.

---

## Browser Compatibility

- **Chrome/Edge** (recommended) – Full support including notification API
- **Firefox** – Full support including notification API
- **Safari** – Full support (notification API may require user interaction)
- **Mobile Browsers** – Responsive design works on tablets and phones

---

## Performance Considerations

- **Code Splitting** – Automatic code splitting via Vite
- **Tree Shaking** – Unused code elimination
- **Optimized Animations** – GPU-accelerated animations with Framer Motion
- **Lazy Loading** – Images and components loaded on demand
- **Model Caching** – ML models loaded once at backend startup
- **Bundle Size** – Minified and compressed production builds
- **Local Storage** – Efficient chat session management with indexed access

---

## Troubleshooting

### Common Issues

**Backend not starting:**

- Verify Python 3.11+ is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check `.env` file has valid `GEMINI_API_KEY`
- Ensure port 8000 is not in use

**Frontend build errors:**

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is LTS (v18+)
- Check for TypeScript errors: Review build output

**Gemini API errors:**

- Verify `GEMINI_API_KEY` is correct in `.env` file
- Check API key has proper permissions in Google AI Studio
- Ensure `google-generativeai` is installed: `pip install google-generativeai`

**Notification monitoring not working:**

- **Desktop:** Verify WinBridge DLL is in `desktop/winbridge/` folder
- **Desktop:** Check Windows notification access is granted
- **Mobile:** Ensure notification listener permission is enabled in Android settings
- **Web:** Check browser notification permission is granted

**Chat not persisting:**

- Verify `localStorage` is enabled in browser
- Check browser storage quota isn't exceeded
- Clear browser cache if issues persist

**Styling issues:**

- Verify Tailwind CSS is properly configured
- Check that `index.css` imports Tailwind directives
- Clear browser cache if styles aren't updating

---

## Security & Privacy

- **No Message Logging** – User messages are never stored or logged
- **Analytics Only** – Only emotion, severity, and response time metadata logged
- **Local Storage** – Chat sessions stored locally in browser, never sent to server
- **Authentication** – Supabase Auth with email verification
- **CORS Protection** – Backend configured with specific allowed origins
- **Environment Variables** – Sensitive keys stored in `.env`, never committed

---

## Contributing

We welcome contributions! Here are some guidelines:

1. **Open issues** with clear reproduction steps and environment information
2. **Submit PRs** following existing code style and structure
3. **Test thoroughly** before submitting, especially emotion/harassment detection
4. **Update documentation** if adding new features or changing behavior

---

## License

This project is proprietary software. All rights reserved.

For licensing inquiries, please contact the project maintainer.

---

## Acknowledgments

- **Google Gemini** – For powerful AI response generation
- **Hugging Face** – For emotion and harassment detection models
- **React Team** – For the powerful frontend framework
- **Framer Motion** – For smooth, performant animations
- **Tailwind CSS** – For rapid, maintainable styling
- **Radix UI** – For accessible component primitives
- **FastAPI** – For high-performance Python backend
- **Electron** – For cross-platform desktop application
- **React Native** – For mobile application development

---

## Contact & Support

- **Local Development**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Original Design**: [Figma Design](https://www.figma.com/design/qnZgddXNeGURg2UlzOXw0f/EmpathAI-Phase-4-Enhancements)

---

## References

- [Vite Documentation](https://vite.dev/guide/) – Getting Started with Vite
- [React Documentation](https://react.dev/) – Learn React
- [FastAPI Documentation](https://fastapi.tiangolo.com/) – FastAPI Guide
- [Google Gemini API](https://ai.google.dev/docs) – Gemini API Documentation
- [Framer Motion Documentation](https://www.framer.com/motion/) – Animation Library
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) – Styling Framework
- [Radix UI Documentation](https://www.radix-ui.com/) – UI Components
- [Electron Documentation](https://www.electronjs.org/docs) – Desktop App Framework
- [React Native Documentation](https://reactnative.dev/docs) – Mobile App Framework

---

**Built with 💜 for those who need emotional, mental, and legal support.**

© 2025 EmpathAI. All rights reserved.
