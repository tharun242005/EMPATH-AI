# EmpathAI V4 - Complete Deployment Guide

## Overview
This guide will help you deploy EmpathAI with all the latest V4 features including conversation persistence, forgot password functionality, and improved UI/UX.

## Prerequisites
- Supabase project (free tier is fine)
- Node.js 18+ installed
- Git installed

## Step 1: Supabase Database Setup

### 1.1 Run SQL Migrations

Go to your Supabase Dashboard → SQL Editor and run the following migrations in order:

#### Migration 1: Create Profiles Table
```sql
-- Note: This should already exist, but run if needed
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Migration 2: Create Conversations Table
```sql
-- Run the contents of /supabase/migrations/003_create_conversations_table.sql
```

Copy and paste the entire contents of `/supabase/migrations/003_create_conversations_table.sql` into the SQL Editor.

### 1.2 Configure Email Templates (For Forgot Password)

1. Go to: **Authentication → Email Templates**
2. Update the "Reset Password" template:
   - Subject: `Reset Your EmpathAI Password`
   - Message template (recommended):
```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>We received a request to reset your password for your EmpathAI account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Stay well,<br>The EmpathAI Team 💜</p>
```

### 1.3 Configure Site URL

1. Go to: **Authentication → URL Configuration**
2. Set **Site URL** to your deployment URL:
   - For local: `http://localhost:5173`
   - For production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:5173/**` (for local development)
   - `https://yourdomain.com/**` (for production)

## Step 2: Update Environment Variables

Update `/utils/supabase/info.tsx` with your Supabase credentials:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

Find these values in: **Supabase Dashboard → Settings → API**

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and test:
1. ✅ Sign up with email verification
2. ✅ Sign in
3. ✅ Forgot password flow
4. ✅ Chat interface scrolling
5. ✅ Conversation persistence
6. ✅ New chat creation
7. ✅ Conversation history loading
8. ✅ Consent modal (appears once per session)

## Step 5: Deploy to Production

### Option A: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and deploy

### Option B: Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Option C: Deploy to Other Platforms

Make sure to:
- Build with `npm run build`
- Deploy the `dist` folder
- Set the redirect rules for SPA (Single Page App)

## Step 6: Post-Deployment Verification

After deployment, verify:

1. **Authentication Flow**:
   - [ ] Sign up works
   - [ ] Email verification works
   - [ ] Sign in works
   - [ ] Forgot password works
   - [ ] Password reset email arrives

2. **Chat Functionality**:
   - [ ] Messages send correctly
   - [ ] AI responds
   - [ ] Messages are saved to database
   - [ ] Can load previous conversations
   - [ ] Conversations grouped by date
   - [ ] Only message area scrolls (not whole page)

3. **UI/UX**:
   - [ ] Landing page image visible at 15%
   - [ ] No excessive gap at top of chat
   - [ ] Footer shows "Owned by Tharun P"
   - [ ] Consent modal appears only once per login
   - [ ] Forgot password link visible on login

## Step 7: Optional - Replace Keyword AI with OpenAI

Currently, the AI uses keyword-based responses. To upgrade to OpenAI:

1. Get OpenAI API key from https://platform.openai.com/
2. Update `/supabase/functions/server/index.tsx` to use OpenAI API
3. Add OpenAI key to environment variables
4. Redeploy the Edge Function

Example OpenAI integration:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// In the /respond endpoint:
const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo-preview",
  messages: [
    {
      role: "system",
      content: "You are EmpathAI, a compassionate emotional support companion..."
    },
    ...context.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text
    })),
    {
      role: "user",
      content: text
    }
  ],
  temperature: 0.7,
  max_tokens: 500,
});

const reply = completion.choices[0].message.content;
```

## Troubleshooting

### Issue: Conversations not saving
- Check Supabase RLS policies are enabled
- Verify user is authenticated
- Check browser console for errors
- Verify SQL migration ran successfully

### Issue: Forgot password not working
- Check email template is configured
- Verify Site URL and Redirect URLs are correct
- Check Supabase email settings
- Look for emails in spam folder

### Issue: Consent modal keeps appearing
- Clear browser cache
- Check if `sessionStorage` is blocked
- Verify the consent logic in Chat.tsx

### Issue: Whole page scrolling instead of messages
- Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache
- Check CSS is loading correctly

## Support

For issues or questions:
- Email: run40081@gmail.com
- Check `/FIXES_COMPLETED_V4.md` for details on all fixes

## Security Notes

1. **Never commit** Supabase credentials to Git
2. Use environment variables for all secrets
3. Keep RLS policies enabled
4. Review and update security policies regularly
5. Monitor Supabase dashboard for unusual activity

## Performance Tips

1. Consider adding indexes on frequently queried columns
2. Implement pagination for conversations (if you have many)
3. Use Supabase's realtime features for live updates
4. Optimize images and assets
5. Enable caching where appropriate

---

**Built with ❤️ by Tharun P**
