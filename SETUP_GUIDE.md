# RoyalMatch ATS - Setup Guide

This guide will walk you through setting up and running the RoyalMatch ATS application.

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm, yarn, or pnpm** package manager
- **OpenAI API Key** OR **Google Gemini API Key**

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# AI Provider Configuration
# Choose either "openai" or "gemini"
AI_PROVIDER="openai"

# OpenAI API Key (required if AI_PROVIDER=openai)
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Google Gemini API Key (required if AI_PROVIDER=gemini)
# Get your key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth Configuration (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Important Notes:**
- Replace `sk-your-openai-api-key-here` with your actual OpenAI API key if using OpenAI
- Replace `your-gemini-api-key-here` with your actual Gemini API key if using Gemini
- You only need to set the API key for the provider you're using
- For `NEXTAUTH_SECRET`, generate a random string (you can use: `openssl rand -base64 32`)

### 3. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Create and migrate the database
npm run db:push
```

This will create a SQLite database file (`dev.db`) in your project root.

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Getting API Keys

### OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file as `OPENAI_API_KEY`

**Note:** OpenAI API usage is paid. Check their pricing at [https://openai.com/pricing](https://openai.com/pricing)

### Google Gemini API Key

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file as `GEMINI_API_KEY`

**Note:** Gemini API has a free tier with usage limits. Check their pricing at [https://ai.google.dev/pricing](https://ai.google.dev/pricing)

## Switching AI Providers

To switch between OpenAI and Gemini:

1. Open your `.env` file
2. Change `AI_PROVIDER` to either `"openai"` or `"gemini"`
3. Make sure the corresponding API key is set
4. Restart the development server

## Main User Flow

### 1. Job Matching
1. Navigate to **Job Match** page from the navigation
2. Upload your resume (TXT, PDF, or DOCX) or paste resume text
3. Paste the job description in the text area
4. Click **Analyze Match**
5. Review your match score and detailed breakdown

### 2. Resume Optimization
1. Navigate to **Optimize** page
2. Paste your resume and job description
3. Click **Generate Optimization Plan**
4. Expand each step to see before/after suggestions
5. Copy suggested improvements to your resume

### 3. Layout Check
1. Navigate to **Layout Check** page
2. Upload or paste your resume
3. Click **Check Layout**
4. Review ATS compatibility score and recommendations

### 4. Resume Builder
1. Navigate to **Resume Builder** page
2. Fill in personal information, headline, summary
3. Add skills, work experience (with bullet points), and education
4. Click **Save Resume** (currently saves to local state - implement database save)

### 5. Resume Manager
1. Navigate to **Resume Manager** page
2. View all your saved resumes
3. Edit, clone, delete, or set as primary

### 6. LinkedIn Tracker
1. Navigate to **LinkedIn Tracker** page
2. Click **Add Application**
3. Fill in job details and status
4. Track your applications over time

## Database Management

### View Database in Prisma Studio

```bash
npm run db:studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) where you can view and edit your database.

### Reset Database

To reset your database:

```bash
# Delete the database file
rm dev.db  # On Windows: del dev.db

# Recreate it
npm run db:push
```

## Production Deployment

### Switching to PostgreSQL

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/royalmatch?schema=public"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### "API key not set" error
- Make sure your `.env` file exists in the root directory
- Verify the API key is correctly set (no extra spaces or quotes)
- Restart the development server after changing `.env`

### Database errors
- Run `npm run db:generate` to regenerate Prisma client
- Run `npm run db:push` to sync your schema
- Check that `DATABASE_URL` is set correctly in `.env`

### AI API errors
- Verify your API key is valid and has credits/quota
- Check the `AI_PROVIDER` environment variable matches your API key
- Review API rate limits and usage quotas

### Port already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Next Steps

- Implement proper PDF/DOCX parsing (currently supports text files)
- Add authentication with NextAuth
- Connect Resume Builder and Manager to database
- Add export functionality (PDF, DOCX)
- Implement resume versioning and history

## Support

For issues or questions, check the main README.md file or review the code comments for implementation details.

