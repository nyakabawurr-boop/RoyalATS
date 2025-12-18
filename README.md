# RoyalMatch ATS

A modern web application that helps job seekers optimize their resumes, align with job descriptions, and track their applications. Built with Next.js, TypeScript, Tailwind CSS, and AI-powered analysis.

## Features

- **Job Matching**: Upload your resume and paste a job description to get an ATS-style match score with detailed breakdowns
- **AI Optimization**: Receive step-by-step guidance to improve your resume's alignment with job descriptions
- **Layout Checker**: Analyze resume formatting for ATS compatibility
- **Resume Builder**: Create and manage multiple resume versions with a form-based editor
- **Resume Manager**: Store, organize, and manage all your resume versions
- **LinkedIn Tracker**: Track job applications across different platforms

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui style)
- **Backend**: Next.js API Routes
- **Database**: SQLite via Prisma (easily swappable to Postgres)
- **AI Integration**: OpenAI (ChatGPT) or Google Gemini

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- An OpenAI API key OR Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RoyalMatch
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# AI Provider Configuration
AI_PROVIDER="openai"  # or "gemini"
OPENAI_API_KEY="your-openai-api-key-here"
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Provider Configuration

The app supports both OpenAI and Google Gemini. Switch between them using the `AI_PROVIDER` environment variable.

### Using OpenAI (ChatGPT)
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Set `AI_PROVIDER="openai"` in your `.env` file
3. Add your API key: `OPENAI_API_KEY="sk-..."`

### Using Google Gemini
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set `AI_PROVIDER="gemini"` in your `.env` file
3. Add your API key: `GEMINI_API_KEY="your-key-here"`

## User Flow

### 1. Job Matching
1. Navigate to **Job Match** page
2. Upload your resume (TXT, PDF, or DOCX) or paste resume text
3. Paste the job description
4. Click **Analyze Match** to get:
   - Overall match score (0-100)
   - Category breakdown (Skills, Experience, Education, Relevance)
   - Matched and missing keywords
   - Detailed feedback

### 2. Resume Optimization
1. Navigate to **Optimize** page
2. Paste your resume and job description
3. Click **Generate Optimization Plan**
4. Review step-by-step suggestions with before/after examples
5. Copy suggested improvements to your resume

### 3. Resume Builder
1. Navigate to **Resume Builder** page
2. Fill in personal information, headline, summary
3. Add skills, work experience, education
4. Save your resume

### 4. Resume Manager
1. Navigate to **Resume Manager** page
2. View all your saved resumes
3. Edit, clone, or delete resumes
4. Mark a resume as "Primary"

### 5. LinkedIn Tracker
1. Navigate to **LinkedIn Tracker** page
2. Add job applications manually
3. Track status: Interested, Applied, Interview, Offer, Rejected
4. Link applications to specific resume versions

## Project Structure

```
RoyalMatch/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── match/         # Job matching endpoint
│   │   ├── optimize/      # Optimization endpoint
│   │   └── layout-check/  # Layout analysis endpoint
│   ├── job-match/         # Job matching page
│   ├── optimize/          # Optimization page
│   ├── resume-builder/    # Resume builder page
│   ├── resume-manager/    # Resume manager page
│   └── linkedin-tracker/  # Application tracker page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── ...               # Feature components
├── lib/                  # Utility functions
│   ├── ai.ts             # AI integration layer
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## Database Schema

The app uses Prisma with SQLite (easily swappable to Postgres). Main models:

- **User**: User accounts (optional auth)
- **Resume**: Stored resume versions
- **MatchSession**: Job matching analysis results
- **JobApplication**: Tracked job applications

## Development

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Building for Production
```bash
npm run build
npm start
```

## Notes

- **Resume Parsing**: The current implementation supports text files. For production, integrate libraries like `pdf-parse` for PDFs and `mammoth` for DOCX files.
- **Authentication**: The app includes a scaffold for NextAuth but authentication is optional. Implement user sessions as needed.
- **Database**: SQLite is used for development. To switch to Postgres, update `DATABASE_URL` in `.env` and change the provider in `prisma/schema.prisma`.

## License

MIT

