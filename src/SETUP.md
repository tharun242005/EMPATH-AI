# 🚀 EmpathAI V2 - Complete Setup Guide

This guide will help you set up the enhanced EmpathAI application with all features including 3D animations, voice assistant, and Supabase authentication.

## 📋 Prerequisites

- Supabase account (already configured in Figma Make)
- Modern browser with Web Speech API support
- Internet connection for 3D libraries

## 🗄️ Database Setup

### Step 1: Run SQL Migrations

Execute the following SQL in your Supabase SQL Editor:

```sql
-- ============================================
-- EMPATHAI DATABASE SCHEMA
-- ============================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
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

-- 2. Create interactions table (anonymized analytics only)
CREATE TABLE IF NOT EXISTS interactions (
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

-- 3. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after insert on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- ============================================
-- CONFIRMATION
-- ============================================

SELECT 'EmpathAI database setup completed successfully! ✅' AS status;
```

### Step 2: Configure Email Templates (Optional but Recommended)

In your Supabase Dashboard:

1. Go to **Authentication > Email Templates**
2. Customize the "Confirm signup" template with your branding
3. Enable "Email Confirmations" in Authentication settings

## 🎨 Features Implemented

### ✅ **Enhanced Design System**
- **Plus Jakarta Sans** typography
- **3D glassmorphism** cards with depth
- **Gradient flows** and lens flare effects
- **Particle waves** background
- **Emotion-driven** color transitions

### ✅ **3D Components**
- **React Three Fiber** powered 3D heart
- **Floating animated orbs** with Motion
- **Interactive 3D models** on landing page

### ✅ **Voice Features**
- **Speech-to-Text** input (mic button)
- **Text-to-Speech** output (speaker button)
- **Voice selection** in settings
- **Auto-speak** option for AI responses

### ✅ **Chat Enhancements**
- **Collapsible sidebar** with hamburger menu
- **Smart auto-scroll** (only when near bottom)
- **Hidden emotion/severity** from user view
- **Floating help button** with legal resources
- **Pulse glow** when distress detected

### ✅ **Authentication**
- **Email verification** required
- **Password visibility toggle**
- **Enhanced error messages**
- **Smooth animations**

### ✅ **Backend AI**
- **Emotion detection** (9 emotions)
- **Severity scoring** (0-5 scale)
- **Harassment detection**
- **Empathetic responses**

## 🎯 Testing the Application

### 1. Test Authentication Flow

```bash
# Create account
- Sign up with a real email
- Check inbox for verification link
- Click link to verify
- Sign in with credentials
```

### 2. Test Chat Features

```bash
# Test emotion detection
- Send: "I'm feeling really sad today"
  Expected: Blue gradient, sad emotion detected

- Send: "I'm so angry about this"
  Expected: Red/orange gradient, angry emotion

- Send: "I need help, I can't take this anymore"
  Expected: Emergency alert shows, severity 4-5
```

### 3. Test Voice Assistant

```bash
# Speech-to-Text
- Click microphone icon
- Allow browser permissions
- Speak your message
- Should transcribe and populate input

# Text-to-Speech
- Click speaker icon to enable
- Send a message
- AI response should be read aloud
```

### 4. Test Sidebar

```bash
# Desktop (>768px)
- Sidebar should be open by default
- Click X to close, Menu to open

# Mobile (<768px)
- Sidebar should be closed by default
- Click hamburger menu to open
- Sidebar should overlay content
```

## 🔐 Privacy Features

### Data Handling
- ✅ **No raw messages stored** - Only processed in memory
- ✅ **Anonymized analytics** - Emotion type + severity only
- ✅ **User consent modal** - Explicit permission required
- ✅ **Local storage only** - User preferences stay local

### Security
- ✅ **Row Level Security** enabled on all tables
- ✅ **Email verification** required for auth
- ✅ **Encrypted transport** via HTTPS
- ✅ **No PII collection** beyond email

## 🎨 Customization

### Colors

Edit `/styles/globals.css` to change the color palette:

```css
--empath-indigo: #4B3F72;     /* Primary brand color */
--empath-mauve: #C27691;      /* Accent color */
--empath-peach: #FFB6A3;      /* Warm accent */
--empath-beige: #FFE6A7;      /* Light accent */
--empath-violet: #6C4B8C;     /* Dark accent */
--empath-blue: #5D8AA8;       /* Cool accent */
```

### Fonts

The app uses **Plus Jakarta Sans** from Google Fonts. To change:

1. Update import in `/styles/globals.css`
2. Modify `font-family` in body styles

## 📱 Responsive Breakpoints

```
Mobile:  < 640px   - Single column, collapsed sidebar
Tablet:  640-1024px - Optimized layout
Desktop: > 1024px   - Full experience, expanded sidebar
```

## 🚨 Troubleshooting

### Issue: 3D Heart Not Showing
**Solution:** Ensure React Three Fiber libraries are loaded. Check console for errors.

### Issue: Voice Not Working
**Solution:** 
- Check browser permissions for microphone
- Ensure using HTTPS (required for Web Speech API)
- Try Chrome/Edge (best support)

### Issue: Email Verification Not Received
**Solution:**
- Check spam folder
- Verify Supabase email settings
- Check email quota in Supabase dashboard

### Issue: Sidebar Not Toggling on Mobile
**Solution:**
- Clear browser cache
- Check window width in dev tools
- Ensure JavaScript is enabled

## 🔄 Update Checklist

When updating the application:

- [ ] Test authentication flow
- [ ] Verify email sending
- [ ] Test all emotion types
- [ ] Check voice features
- [ ] Validate responsive design
- [ ] Test sidebar on mobile/desktop
- [ ] Verify database connections
- [ ] Check error handling
- [ ] Test emergency alerts
- [ ] Validate privacy features

## 📊 Performance Optimization

### Lazy Loading
The 3D heart component is lazy-loaded for better performance:

```typescript
const Heart3D = lazy(() => import('../components/Heart3D'));
```

### Memoization
Consider memoizing heavy components:

```typescript
const MemoizedMessageBubble = memo(MessageBubble);
```

### Debouncing
Add debouncing to voice input if needed:

```typescript
const debouncedTranscript = debounce(onTranscript, 300);
```

## 🌟 Next Steps

1. **Add PWA Support** - Make app installable
2. **Implement Notifications** - Push notifications for check-ins
3. **Add Therapist Matching** - Connect with professionals
4. **Multi-language Support** - i18n integration
5. **Advanced AI Models** - Integrate GPT-4 or Claude
6. **Journal Feature** - Encrypted personal journaling
7. **Crisis Detection** - Enhanced ML for crisis situations

## 📞 Support

For questions or issues:
- Email: run40081@gmail.com
- Check documentation in `/README.md`
- Review code comments in components

---

**Built with 💜 for those who need support**

© 2025 EmpathAI
