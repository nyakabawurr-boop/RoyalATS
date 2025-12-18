# Quick Vercel Deployment Steps

## 🚀 Deploy in 5 Minutes

### Step 1: Update Prisma Schema for PostgreSQL

**IMPORTANT:** Vercel doesn't support SQLite. You must use PostgreSQL.

1. Open `prisma/schema.prisma`
2. Change line 9 from:
   ```prisma
   provider = "sqlite"
   ```
   To:
   ```prisma
   provider = "postgresql"
   ```

### Step 2: Commit and Push Changes

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository: `nyakabawurr-boop/RoyalATS`
3. Vercel will auto-detect Next.js settings ✅

### Step 4: Add Environment Variables

In Vercel project settings → Environment Variables, add:

**Required:**
```
DATABASE_URL=your-postgres-connection-string
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
```

**OR if using OpenAI:**
```
DATABASE_URL=your-postgres-connection-string
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
```

### Step 5: Set Up Database (Choose One)

#### Option A: Vercel Postgres (Easiest)
1. In Vercel project → "Storage" tab
2. Click "Create Database" → "Postgres"
3. Vercel auto-adds `POSTGRES_URL` as `DATABASE_URL` ✅

#### Option B: External PostgreSQL
Use services like:
- **Supabase**: https://supabase.com (Free tier)
- **Neon**: https://neon.tech (Free tier)
- **Railway**: https://railway.app

Copy the connection string and paste as `DATABASE_URL`

### Step 6: Deploy

Click "Deploy" and wait 2-3 minutes! 🎉

### Step 7: Push Database Schema

After deployment succeeds:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Push schema:
   ```bash
   npx prisma db push
   ```

**OR** use Vercel's built-in terminal in the dashboard.

## ✅ That's It!

Your app will be live at: `https://your-project.vercel.app`

## 🔧 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure `DATABASE_URL` is set
- Verify Prisma schema uses `postgresql` (not `sqlite`)

**Database errors?**
- Make sure you ran `npx prisma db push` after first deployment
- Verify connection string format: `postgresql://user:pass@host:5432/dbname`

**API errors?**
- Check API keys are set correctly
- Review function logs in Vercel dashboard

