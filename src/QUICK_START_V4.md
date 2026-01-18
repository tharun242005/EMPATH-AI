# EmpathAI V4 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Database Setup (2 minutes)
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy & paste from: `/supabase/migrations/003_create_conversations_table.sql`
4. Click **Run**

### Step 2: Email Configuration (1 minute)
1. Go to **Authentication → Email Templates**
2. Select "Reset Password"
3. Update subject and body (optional, default works fine)

### Step 3: URL Configuration (30 seconds)
1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `http://localhost:5173`
3. Add **Redirect URL**: `http://localhost:5173/**`

### Step 4: Run Locally (1 minute)
```bash
npm install
npm run dev
```

### Step 5: Test Everything (30 seconds)
Visit `http://localhost:5173` and verify:
- ✅ Landing page shows image at 15%
- ✅ Sign up works
- ✅ Sign in works
- ✅ Chat scrolls properly (only messages area)
- ✅ Consent modal appears once
- ✅ Forgot password works
- ✅ Footer shows "Owned by Tharun P"

## ✨ What's New in V4

1. **Landing Page**: Image now 15% visible
2. **Chat Scrolling**: Fixed! Only messages scroll
3. **Conversation History**: ChatGPT-like history with date grouping
4. **Forgot Password**: Complete password reset flow
5. **One-Time Consent**: Modal appears once per login session
6. **Footer**: Updated with your name
7. **Bug Fixes**: Top gap removed, better layout

## 📝 Important Files

- `/COMPLETE_V4_SUMMARY.md` - Full feature list
- `/DEPLOYMENT_GUIDE_V4.md` - Complete deployment guide
- `/FIXES_COMPLETED_V4.md` - Technical documentation
- `/supabase/migrations/003_create_conversations_table.sql` - Database schema

## 🐛 Troubleshooting

**Problem**: Conversations not saving  
**Solution**: Check if SQL migration ran successfully

**Problem**: Forgot password not working  
**Solution**: Configure email template and Site URL in Supabase

**Problem**: Consent modal keeps appearing  
**Solution**: Clear browser cache and sessionStorage

**Problem**: Whole page scrolling  
**Solution**: Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

## 📚 Documentation

Full documentation available in:
- `/DEPLOYMENT_GUIDE_V4.md` - Step-by-step deployment
- `/COMPLETE_V4_SUMMARY.md` - Complete feature overview

## 💬 Support

Questions? Email: run40081@gmail.com

---

**That's it! You're ready to go! 🎉**
