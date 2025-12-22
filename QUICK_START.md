# Quick Start - Manual Setup Steps

## Follow these steps to set up your Gemini API Key:

### Step 1: Install Node.js (if not already installed)
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Install it and restart your terminal
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create .env file
Create a file named `.env` in the root directory with this content:

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

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Open Browser
Visit http://localhost:3000

---

## If you already have Node.js installed:

Just run these commands in order:
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Make sure to create the `.env` file first with your Gemini API key!
