# Gemini API Troubleshooting

Your Gemini API key is returning 404 errors for all model attempts. Here are steps to resolve this:

## Option 1: Verify Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify your API key is active
3. Check if there are any restrictions on your key

## Option 2: Check Available Models

Your API key might only have access to certain models. You can check by:

1. Visit: `https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY`
2. Replace `YOUR_API_KEY` with your actual key
3. This will show you which models are available

## Option 3: Try Using Google AI Studio Directly

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Test if your API key works there
3. Note which model names work

## Option 4: Use OpenAI Instead (If You Add Billing)

If you can add billing to your OpenAI account:

1. Go to https://platform.openai.com/account/billing
2. Add a payment method
3. Update `.env` to set `AI_PROVIDER="openai"`

## Option 5: Create a New API Key

Sometimes API keys have restrictions. Try creating a new one:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update `.env` with the new key

## Current Status

- ✅ Configuration: Gemini API key is set
- ❌ Models: All model attempts returning 404
- 🔍 Next Step: Verify API key permissions and available models

If none of these work, the API key might not have access to the Gemini API, or there might be regional restrictions.

