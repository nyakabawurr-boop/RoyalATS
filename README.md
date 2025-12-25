# RoyalMatch ATS

A modern web application that helps job seekers optimize their resumes, align with job descriptions, and track their applications. Built with Next.js, TypeScript, Tailwind CSS, and AI-powered analysis.

## Features

- **Job Matching**: Upload your resume and paste a job description to get an ATS-style match score with detailed breakdowns
- **AI Optimization**: Receive step-by-step guidance to improve your resume's alignment with job descriptions, with before/after ATS scoring comparison
- **Cover Letter Generator**: Generate tailored, ATS-friendly cover letters for specific job applications with customizable tone and length. Includes editing, DOCX download, and save functionality.
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

### 2. Resume Optimization with ATS Scoring
1. Navigate to **Optimize** page
2. Paste your resume and job description
3. **Baseline Score** automatically calculates and displays:
   - Overall Match % (0-100)
   - Skills Match % (0-100)
   - Ranking (Strong/Moderate/Weak)
   - Missing skills and keywords
4. Click **Generate Optimization Plan**
5. Review step-by-step suggestions with before/after examples
6. **After Score** automatically calculates using the optimized resume:
   - Compare before vs after scores with delta improvements
   - See improvements in skills alignment
   - Review missing skills/keywords that were addressed
7. Toggle between original and optimized resume preview
8. Edit the optimized resume manually and recalculate the after score
9. Copy suggested improvements to your resume

### 2a. Cover Letter Generation
1. After generating an optimization plan, the **Cover Letter** section automatically appears
2. The cover letter is automatically generated using the same resume and job description
3. You can customize the cover letter by selecting tone (Professional, Enthusiastic, or Concise) and length (Short or Standard) before generation, or use **Regenerate** after
4. Edit the generated content as needed in the textarea
5. Use actions:
   - **Copy** to clipboard
   - **Download .docx** to save as a Word document with proper formatting
   - **Save Cover Letter** to store in the database
   - **Regenerate** to create a new version with current settings

### 3. Resume Builder
1. Navigate to **Resume Builder** page
2. **Import existing resume** (optional):
   - Click "Import Resume" button
   - Upload PDF, DOCX, TXT, or JSON file
   - The app will parse and populate form fields automatically
   - Review and adjust imported data as needed
3. Fill in personal information, headline, summary
4. Add skills, work experience, education
5. Save your resume

**Supported Import Formats:**
- **PDF**: Text-based PDFs only (password-protected or image-only PDFs may fail)
- **DOCX**: Microsoft Word documents (2007+)
- **TXT**: Plain text files
- **JSON**: Exported resume JSON files

**Import Limitations:**
- PDF/DOCX parsing extracts text content only; formatting is not preserved
- Complex layouts may require manual adjustment
- Maximum file size: 10MB

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
│   │   ├── optimize/      # Optimization endpoint (returns plan + optimized resume)
│   │   ├── score/         # ATS scoring endpoint (before/after comparison)
│   │   ├── cover-letter/  # Cover letter generation endpoint
│   │   └── layout-check/  # Layout analysis endpoint
│   ├── job-match/         # Job matching page
│   ├── optimize/          # Optimization page
│   ├── resume-builder/    # Resume builder page
│   ├── resume-manager/    # Resume manager page
│   └── linkedin-tracker/  # Application tracker page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── cover-letter-panel.tsx  # Cover letter UI component
│   ├── score-comparison-card.tsx  # Before/after score comparison component
│   └── ...               # Feature components
├── lib/                  # Utility functions
│   ├── ai.ts             # AI integration layer
│   ├── prisma.ts         # Prisma client
│   ├── cover-letter-export.ts  # DOCX export for cover letters
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## Database Schema

The app uses Prisma with PostgreSQL (or SQLite for development). Main models:

- **User**: User accounts (optional auth)
- **Resume**: Stored resume versions
- **MatchSession**: Job matching analysis results
- **JobApplication**: Tracked job applications
- **CoverLetter**: Saved cover letters linked to resumes and job applications

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

## Scoring System

The app uses a hybrid scoring approach:
- **AI Extraction**: Extracts skills and keywords from resume and job description
- **Deterministic Calculation**: Calculates scores using a clear rubric:
  - Skills Match % = (matched required skills + 0.5 × matched preferred skills) / total skills weight × 100
  - Keyword Match % = matched keywords / total keywords × 100
  - Overall Match % = 60% skills + 30% keywords + 10% role alignment
  - Ranking: Strong (≥75%), Moderate (50-74%), Weak (<50%)

The same scoring algorithm is used for both before and after optimization to ensure fair comparison.

## Testing Features

### Testing Optimization with Scoring

1. **Baseline Score Calculation**:
   - Go to Optimize page
   - Paste resume text and job description
   - Baseline score should automatically calculate after 1 second
   - Verify score displays: Overall Match %, Skills Match %, Ranking

2. **After Optimization Score**:
   - Click "Generate Optimization Plan"
   - Wait for optimization to complete
   - After score should automatically calculate
   - Verify comparison shows delta improvements (+/- %)

3. **Recalculate Score**:
   - Edit the optimized resume manually
   - Click "Recalculate After Score"
   - Verify new score is calculated

### Testing Cover Letter Feature

After setting up the app, test the cover letter feature:

1. **Generate Optimization Plan**: 
   - Go to Optimize page
   - Paste resume text and job description
   - Click "Generate Optimization Plan"
   - Verify optimization plan appears

2. **Auto-Generate Cover Letter**:
   - After optimization plan is generated, the Cover Letter section automatically appears
   - Cover letter starts generating automatically
   - Verify cover letter appears with proper formatting
   - Verify it's tailored to the job description and resume

3. **Regenerate Cover Letter**:
   - Optionally change tone (Professional/Enthusiastic/Concise) or length (Short/Standard)
   - Click "Regenerate" button
   - Verify new cover letter is generated with updated settings

4. **Save Cover Letter**:
   - Click "Save Cover Letter" button
   - Verify success message appears ("Saved!" with checkmark)
   - Check database (via Prisma Studio: `npx prisma studio`) to confirm it's saved

5. **Download DOCX**:
   - Click "Download .docx" button
   - Verify file downloads with proper filename format: "Cover Letter - [Company] - [Role].docx"
   - Open file in Microsoft Word or Google Docs
   - Verify formatting is correct (header, date, body paragraphs)

6. **Copy to Clipboard**:
   - Click "Copy" button
   - Verify button shows "Copied!" feedback
   - Paste in a text editor to verify content

7. **Edit Cover Letter**:
   - Edit the text in the textarea
   - Verify changes are preserved
   - Verify edited content can be saved and downloaded

8. **Test with Different AI Providers**:
   - Test with `AI_PROVIDER=gemini` (set in .env)
   - Test with `AI_PROVIDER=openai` (if you have OpenAI key)
   - Verify cover letter quality is good with both providers

## Notes

- **Resume Parsing**: The current implementation supports text files. For production, integrate libraries like `pdf-parse` for PDFs and `mammoth` for DOCX files.
- **Authentication**: The app includes a scaffold for NextAuth but authentication is optional. Implement user sessions as needed.
- **Database**: PostgreSQL is used by default. To switch to SQLite for development, update `DATABASE_URL` in `.env` and change the provider in `prisma/schema.prisma`.
- **Cover Letter Generation**: Uses the same AI provider (OpenAI/Gemini) as configured in environment variables. Cover letters are ATS-friendly and can be customized by tone and length.

## License

MIT

