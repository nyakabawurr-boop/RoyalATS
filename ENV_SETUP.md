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
GEMINI_API_KEY="AIzaSyAaMdD3AiNBBsfpHW7_2_QROsVWHXfy2T8"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Your Gemini API key is already included above!**

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

