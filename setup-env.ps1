# PowerShell script to create .env file with Gemini API key

$envContent = @"
# Database
DATABASE_URL="file:./dev.db"

# AI Provider Configuration
AI_PROVIDER="gemini"
OPENAI_API_KEY=""
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host ".env file created successfully with your Gemini API key!" -ForegroundColor Green

