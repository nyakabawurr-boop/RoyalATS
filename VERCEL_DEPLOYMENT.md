# Vercel Deployment Guide

This guide will help you deploy RoyalMatch ATS to Vercel.

## Prerequisites

1. A GitHub account (you already have the repo: https://github.com/nyakabawurr-boop/RoyalATS)
2. A Vercel account (sign up at https://vercel.com)
3. API keys for your AI provider (OpenAI or Gemini)

## Important: Database Configuration

⚠️ **SQLite will NOT work on Vercel** - Vercel has a read-only filesystem.

You have two options:

### Option 1: Use Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" and select "Postgres"
3. Vercel will automatically create a `POSTGRES_URL` environment variable

### Option 2: Use an External PostgreSQL Database

You can use services like:
- Supabase (free tier available)
- Neon (free tier available)
- Railway
- Render

## Step-by-Step Deployment

### 1. Connect Your GitHub Repository

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Find and select your repository: `nyakabawurr-boop/RoyalATS`
4. Click "Import"

### 2. Configure Project Settings

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `prisma generate && next build` (should auto-detect)
- **Output Directory**: `.next` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### 3. Set Up Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables:

```
DATABASE_URL=your-postgres-connection-string-here
```

If using Vercel Postgres, this will be auto-populated as `POSTGRES_URL`.

#### AI Provider Configuration:

Choose ONE:

**For Gemini:**
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
```

**For OpenAI:**
```
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
```

#### Optional (if using NextAuth):
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

### 4. Update Prisma Schema for PostgreSQL

If you're switching from SQLite to PostgreSQL, you'll need to update your Prisma schema.

**Before deployment, update `prisma/schema.prisma`:**

Change:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then commit and push the change.

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Once deployed, Vercel will provide you with a URL like: `https://royalats.vercel.app`

### 6. Run Database Migrations

After first deployment, you need to push your schema to the database:

1. Go to your Vercel project dashboard
2. Open the terminal/shell (or use Vercel CLI locally)
3. Run: `npx prisma db push`

Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma db push
```

## Troubleshooting

### Build Fails with "Module not found" or Prisma errors

- Make sure `postinstall` script is in package.json (already added)
- Check that `prisma generate` runs during build

### Database Connection Errors

- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Make sure you're using PostgreSQL, not SQLite
- Check that your database is accessible from the internet (if using external DB)

### API Routes Timeout

- API routes have a max duration of 30 seconds (configured in vercel.json)
- For longer operations, consider using Vercel Edge Functions or Background Jobs

### PDF/DOCX Import Not Working

- `pdf-parse` and `mammoth` should work on Vercel
- If you encounter issues, check server logs in Vercel dashboard
- Some large PDFs might timeout - consider adding file size limits

## Post-Deployment

1. **Test all features:**
   - Resume Builder
   - Job Match Tool
   - Resume Optimization
   - Layout Checker
   - PDF/DOCX Import

2. **Set up custom domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Monitor deployments:**
   - Check Vercel dashboard for build logs
   - Monitor function logs for API errors

## Environment Variables Checklist

Before deploying, make sure you have:

- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `AI_PROVIDER` (either "gemini" or "openai")
- [ ] `GEMINI_API_KEY` (if using Gemini) OR `OPENAI_API_KEY` (if using OpenAI)
- [ ] `NEXTAUTH_URL` (your production URL)
- [ ] `NEXTAUTH_SECRET` (if using authentication)

## Need Help?

- Check Vercel logs in the dashboard
- Review the build logs for specific errors
- Verify all environment variables are set correctly

