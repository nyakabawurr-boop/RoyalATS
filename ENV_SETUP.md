# Environment Variables Setup

Your `.env` file needs to be created manually. Here's what to do:

## Create .env file

Create a file named `.env` in the root directory of the project with the following content:

```env
# Database
DATABASE_URL="file:./dev.db"

# AI Provider Configuration
AI_PROVIDER="gemini"
OPENAI_API_KEY=""
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Important:** Replace `your-gemini-api-key-here` with your actual API key from https://makersuite.google.com/app/apikey

## Quick Setup Commands

After creating the `.env` file and installing Node.js:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Start development server
npm run dev
```

