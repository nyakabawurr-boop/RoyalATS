# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
- Set `AI_PROVIDER` to either `"openai"` or `"gemini"`
- Add your API key for the chosen provider
- The database URL is already configured for SQLite

## Step 3: Initialize Database
```bash
npx prisma generate
npx prisma db push
```

## Step 4: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Getting API Keys

### OpenAI (ChatGPT)
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)
5. Add to `.env` as `OPENAI_API_KEY`

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key
5. Add to `.env` as `GEMINI_API_KEY`

## Testing Without API Keys

The app will show errors when trying to use AI features without valid API keys. For testing the UI, you can:
- Use the Resume Builder (no AI required)
- Use the Resume Manager (no AI required)
- Use the LinkedIn Tracker (no AI required)

For AI features (Job Match, Optimize, Layout Check), you'll need valid API keys.

