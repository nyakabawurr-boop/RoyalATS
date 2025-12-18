# 🚀 START HERE - Quick Setup

## ✅ What's Already Done

1. ✅ **All project files created** - Complete Next.js application
2. ✅ **.env file created** - Your Gemini API key is configured
3. ✅ **Setup scripts ready** - Automated setup available

## ⚠️ One Step Remaining: Install Node.js

Node.js is required to run this application. Here's how to install it:

### Install Node.js (5 minutes)

1. **Go to:** https://nodejs.org/
2. **Download:** Click the big green "LTS" button (recommended version)
3. **Install:** Run the downloaded installer
   - ✅ Check "Automatically install the necessary tools"
   - Use all default settings
   - Click "Next" through the wizard
4. **Restart:** Close and reopen your terminal/PowerShell

### Verify Installation

Open a new PowerShell window and run:
```powershell
node --version
npm --version
```

You should see version numbers (like `v20.x.x` and `10.x.x`).

---

## 🎯 After Node.js is Installed

### Option 1: Run the Automated Setup (Easiest)

Just run this one command:
```powershell
.\run-setup.ps1
```

This will automatically:
- ✅ Verify your .env file (already done)
- ✅ Install all dependencies
- ✅ Set up the database
- ✅ Start the development server

### Option 2: Manual Setup

If you prefer manual steps:
```powershell
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

## 🎉 Once Running

1. Open your browser to: **http://localhost:3000**
2. You'll see the RoyalMatch ATS home page
3. Start using the app:
   - **Job Match**: Upload resume + job description → Get match score
   - **Optimize**: Get AI-powered resume improvements
   - **Resume Builder**: Create and manage resumes
   - **LinkedIn Tracker**: Track your job applications

---

## 📋 Your Configuration

- **AI Provider:** Gemini ✅
- **API Key:** Configured in .env ✅
- **Database:** SQLite (auto-created) ✅

---

## ❓ Need Help?

- **Node.js not working?** Restart your computer after installation
- **Script won't run?** Right-click PowerShell → "Run as Administrator"
- **Port 3000 in use?** The app will try the next available port

---

## 🎯 Summary

1. Install Node.js from https://nodejs.org/
2. Run `.\run-setup.ps1`
3. Open http://localhost:3000
4. Start using RoyalMatch ATS!

**Everything else is already configured!** 🚀

