# EmpathAI V2 - AI-Driven Emotional & Legal Companion

EmpathAI is a compassionate AI companion that provides emotional support, mental wellness guidance, and legal resources. Built with privacy-first principles, stunning 3D visuals, and designed to help those in need.

## ✨ What's New in V2

### 🎨 **Enhanced Design**
- **3D Animated Heart** - React Three Fiber powered 3D visualizations
- **Plus Jakarta Sans** - Professional typography
- **Advanced Glassmorphism** - Depth, blur, and shadows
- **Particle Waves** - Dynamic background animations
- **Lens Flare Effects** - Cinematic lighting

### 🗣️ **Voice Assistant**
- **Speech-to-Text** - Speak your thoughts naturally
- **Text-to-Speech** - Hear AI responses read aloud
- **Auto-Speak Mode** - Automatic voice output
- **Visual Feedback** - Pulsing animations when listening

### 💬 **Smart Chat Interface**
- **Collapsible Sidebar** - Hamburger menu toggle
- **Smart Scroll** - Only auto-scrolls when near bottom
- **Hidden Severity** - Clean UI, internal tracking only
- **Floating Help Button** - Quick access to legal resources
- **Emergency Alerts** - Automatic crisis detection

### 🔐 **Enhanced Security**
- **Email Verification** - Required before login
- **Password Toggle** - Show/hide password
- **Better Error Messages** - Clear, helpful feedback
- **Smooth Animations** - Professional transitions

## 🎨 Features

### ✨ Core Features
- **9 Emotion Types** - Happy, sad, angry, anxious, fearful, hopeful, calm, distressed, neutral
- **Severity Scoring** - 0-5 scale for distress level
- **Harassment Detection** - Identifies potentially harmful content
- **Legal Resources** - IPC sections, complaint templates, and helplines
- **Privacy-First** - End-to-end privacy, no message storage
- **Responsive Design** - Beautiful UI that works on all devices
- **Voice I/O** - Full speech recognition and synthesis
- **Emotion-Based Backgrounds** - UI adapts to detected emotional state

### 🎯 Pages
1. **Landing Page** - Animated hero with floating orbs and gradient backgrounds
2. **Chat Interface** - Real-time emotional support with sidebar navigation
3. **Legal Resources** - Downloadable complaint templates and helplines
4. **Settings** - Privacy controls, voice settings, and preferences
5. **Authentication** - Secure sign-up and sign-in with Supabase

## 🚀 Tech Stack

### Frontend
- **React** + **Vite** - Fast, modern development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Supabase Client** - Authentication and data storage

### Backend (Supabase Edge Functions)
- **Hono** - Lightweight web framework
- **Deno** - Secure runtime for edge functions
- **AI Endpoints** - Emotion analysis and response generation

### Database
- **Supabase PostgreSQL** - User profiles and anonymized interactions

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Setup Steps

1. **Clone and Install**
```bash
git clone <repository-url>
cd EmpathAI
npm install
```

2. **Configure Supabase**

Create a Supabase project at https://supabase.com

3. **Run Database Migrations**

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create interactions table (anonymized analytics)
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 0 AND severity <= 5),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Interactions policies
CREATE POLICY "Users can view own interactions" 
  ON interactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert interactions" 
  ON interactions FOR INSERT 
  WITH CHECK (true);

-- Create conversations table (optional summaries)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view own conversations" 
  ON conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" 
  ON conversations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" 
  ON conversations FOR DELETE 
  USING (auth.uid() = user_id);
```

4. **Environment Variables**

The application uses Supabase info from `/utils/supabase/info.tsx` which is auto-configured in Figma Make.

For local development, you would need:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. **Run the Application**
```bash
npm run dev
```

Visit http://localhost:5173

## 🎨 Design System

### Color Palette
- **Indigo** (`#4B3F72`) - Primary, trust
- **Blue** (`#5D8AA8`) - Calm, clarity
- **Beige** (`#FFE6A7`) - Warmth, comfort
- **Peach** (`#FFB6A3`) - Gentle, caring
- **Mauve** (`#C27691`) - Emotional, empathetic
- **Violet** (`#6C4B8C`) - Depth, wisdom

### Typography
- **Font Family**: System fonts (fallback to sans-serif)
- **Responsive Sizes**: Using clamp() for fluid typography
- **Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Animations
- **Floating Orbs** - Background ambient animation
- **Wave Effect** - Bottom of landing page
- **Message Bubbles** - Slide and fade entrance
- **Typing Indicator** - Animated dots
- **Emotion Transitions** - Smooth background color shifts

## 🔌 API Endpoints

### POST `/make-server-8080a8fc/api/analyze_message`
Analyzes message for emotion and severity.

**Request:**
```json
{
  "text": "I'm feeling really anxious today",
  "user_id": "optional-user-uuid"
}
```

**Response:**
```json
{
  "emotion": "anxious",
  "emotion_score": 0.85,
  "harassment_label": "none",
  "severity": 2,
  "summary": "Detected anxious emotion with severity level 2",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST `/make-server-8080a8fc/api/respond`
Generates empathetic AI response.

**Request:**
```json
{
  "text": "I'm feeling overwhelmed",
  "context": []
}
```

**Response:**
```json
{
  "reply": "I understand how overwhelming anxiety can feel...",
  "suggestions": ["breathing_exercise", "grounding_technique"],
  "voice": "Response text for TTS",
  "emotion_detected": "anxious"
}
```

## 🔐 Privacy & Security

### Data Handling
- **No Message Storage** - Conversations processed in real-time, never saved
- **Anonymized Analytics** - Only emotion type and severity stored
- **User Consent** - Explicit consent modal before monitoring
- **Local Storage Only** - User preferences stored locally
- **Encrypted Transport** - All API calls over HTTPS

### Compliance
- GDPR-friendly by design
- Minimal data collection
- User-controlled data deletion
- Transparent privacy policy

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px) - Single column, collapsible sidebar
- **Tablet** (640px - 1024px) - Optimized chat width
- **Desktop** (> 1024px) - Full experience with sidebar

### Adaptive Features
- Collapsible navigation on mobile
- Touch-optimized buttons
- Responsive font scaling
- Flexible layouts

## 🎓 AI Model Training (Future Enhancement)

The application is designed to support custom AI model training:

### Suggested Models
- **Emotion Detection**: Fine-tuned BERT or RoBERTa on GoEmotions dataset
- **Harassment Detection**: Trained on Jigsaw Toxic Comments
- **Summarization**: T5 or BART for conversation summaries

### Training Pipeline
```python
# Example training script (server/model/train.py)
python train.py \
  --model_name_or_path roberta-base \
  --dataset_path data/emotions.csv \
  --output_dir models/emotion \
  --num_train_epochs 3
```

## 🌟 Key Components

### Pages
- `Home.tsx` - Landing page with hero and features
- `Login.tsx` - Authentication page
- `Signup.tsx` - Registration page
- `Chat.tsx` - Main chat interface
- `Legal.tsx` - Legal resources and templates
- `Settings.tsx` - User preferences

### Components
- `FloatingOrbs.tsx` - Animated background elements
- `AnimatedWave.tsx` - SVG wave animation
- `EmotionBadge.tsx` - Displays detected emotion
- `MessageBubble.tsx` - Chat message component
- `TypingIndicator.tsx` - Shows AI is typing
- `ConsentModal.tsx` - Privacy consent dialog
- `Navbar.tsx` - Navigation bar
- `Footer.tsx` - Footer with info

### Context
- `AuthContext.tsx` - Authentication state management

### Services
- `lib/supabase.ts` - Supabase client setup
- `supabase/functions/server/index.tsx` - AI endpoints

## 🚧 Future Enhancements

### Planned Features
1. **Advanced AI Models** - Integration with GPT-4 or Claude
2. **Voice Input** - Speech-to-text for hands-free interaction
3. **Multi-language Support** - Internationalization
4. **PWA Support** - Offline capabilities and notifications
5. **Crisis Detection** - Enhanced severity detection with immediate help
6. **Therapist Matching** - Connect with professional support
7. **Journal Feature** - Encrypted personal journaling
8. **Group Support** - Moderated community forums

### Technical Improvements
- WebSocket for real-time updates
- Advanced caching strategies
- Performance optimizations
- Automated testing suite
- CI/CD pipeline

## 📄 License

This project is for educational and research purposes. Proper licensing should be applied before commercial use.

## ⚠️ Disclaimer

**Important:** EmpathAI provides informational support and is not a substitute for professional medical, psychological, or legal advice. If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.

### Emergency Resources
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing patterns
- Privacy-first principles maintained
- Accessibility standards met
- Documentation updated

## 💬 Support

For questions or support:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

Built with ❤️ for those who need support. You matter, and you're not alone.
