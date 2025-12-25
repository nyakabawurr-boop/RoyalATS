# Vercel Environment Variables Setup Guide

This guide will help you configure your environment variables in Vercel so your app works correctly with Gemini API.

## Step-by-Step Instructions

### 1. Go to Your Vercel Project Dashboard

1. Log in to [Vercel](https://vercel.com)
2. Navigate to your project (RoyalATS)
3. Click on **Settings** (in the top navigation)

### 2. Navigate to Environment Variables

1. In the Settings menu, click on **Environment Variables** (in the left sidebar)
2. You'll see a list of current environment variables (if any)

### 3. Add Required Environment Variables

Click **Add New** and add each of these variables:

#### Variable 1: AI_PROVIDER
- **Key**: `AI_PROVIDER`
- **Value**: `gemini`
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

#### Variable 2: GEMINI_API_KEY
- **Key**: `GEMINI_API_KEY`
- **Value**: `AIzaSyAReV6_ioOGijFHZ_eQi4OK11zw4M6KGpU` (your actual API key)
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

#### Variable 3: DATABASE_URL (if using database)
- **Key**: `DATABASE_URL`
- **Value**: Your PostgreSQL connection string
- **Environment**: Select all
- Click **Save**

#### Optional: NEXTAUTH Variables (if using authentication)
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://your-app-name.vercel.app` (your Vercel app URL)
- **Environment**: Production only

- **Key**: `NEXTAUTH_SECRET`
- **Value**: Generate with: `openssl rand -base64 32`
- **Environment**: All environments

### 4. Redeploy Your Application

After adding environment variables:

1. Go to the **Deployments** tab
2. Click the **⋯** (three dots) menu on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

**Important**: Environment variables are only loaded when the app is built/deployed. You MUST redeploy after adding new variables.

## Security Notes

✅ **Your API keys are secure:**
- Environment variables in Vercel are encrypted
- They are NOT visible in your code or GitHub repository
- They are only accessible to your Vercel project
- They are not exposed to the public

## Verification Checklist

After setting up, verify:

- [ ] `AI_PROVIDER` is set to `gemini`
- [ ] `GEMINI_API_KEY` is set with your API key
- [ ] All variables are enabled for Production, Preview, and Development
- [ ] You've redeployed the application
- [ ] The app is working without the "OPENAI_API_KEY" error

## Troubleshooting

### Error: "OPENAI_API_KEY is not set"
- **Cause**: `AI_PROVIDER` is not set or is set to `openai`
- **Fix**: Set `AI_PROVIDER=gemini` in Vercel environment variables

### Error: "GEMINI_API_KEY is not set"
- **Cause**: `GEMINI_API_KEY` environment variable is missing
- **Fix**: Add `GEMINI_API_KEY` with your API key value in Vercel

### Changes not taking effect
- **Cause**: Environment variables are only loaded during build
- **Fix**: Redeploy your application after adding/updating variables

### How to verify variables are set
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see all your variables listed
3. Make sure they're enabled for the correct environments

## Quick Reference

**Required Variables for Gemini:**
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
```

**Required Variables for OpenAI:**
```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
```

## Need Help?

- Check Vercel logs: Dashboard → Your Project → Deployments → Click on deployment → View Function Logs
- Verify variables are set correctly in Settings → Environment Variables
- Make sure you redeployed after adding variables

