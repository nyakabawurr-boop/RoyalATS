# Installation Instructions

## Step 1: Install Node.js

Node.js is required to run this application. Please install it first:

1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Restart your terminal/PowerShell after installation

Verify installation:
```bash
node --version
npm --version
```

## Step 2: Install Project Dependencies

Once Node.js is installed, run:
```bash
npm install
```

## Step 3: Initialize Database

The `.env` file has already been created with your Gemini API key. Now initialize the database:

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Your Configuration

✅ **Environment variables are already set up:**
- AI Provider: Gemini
- Gemini API Key: Configured
- Database: SQLite (will be created automatically)

## Troubleshooting

If you encounter any issues:
1. Make sure Node.js 18+ is installed
2. Try deleting `node_modules` and running `npm install` again
3. Check that your Gemini API key is valid and has proper permissions

