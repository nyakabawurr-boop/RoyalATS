# Cover Letter Feature - Test Checklist

This document provides a manual testing checklist for the Cover Letter feature in the RoyalMatch ATS app.

## Prerequisites

- [ ] App is running (`npm run dev`)
- [ ] Database is set up (`npx prisma db push`)
- [ ] AI provider is configured (Gemini or OpenAI) in `.env`
- [ ] Server is accessible at http://localhost:3000 (or configured port)

## Test Scenarios

### 1. Basic Cover Letter Generation

**Location**: `/optimize` page

- [ ] Navigate to the Optimize page
- [ ] Paste resume text in the "Resume" textarea
- [ ] Paste job description in the "Job Description" textarea
- [ ] Click "Generate Optimization Plan"
- [ ] Wait for optimization plan to appear
- [ ] Verify "Cover Letter" section appears below the optimization plan
- [ ] Click "Generate Cover Letter" button
- [ ] Wait for cover letter to generate (should show loading state)
- [ ] Verify cover letter text appears in the textarea
- [ ] Verify cover letter is relevant to the job description
- [ ] Verify cover letter mentions specific achievements from resume
- [ ] Verify cover letter is ATS-friendly (no tables, symbols, or fancy formatting)

### 2. Tone and Length Selection

- [ ] Before generating, select "Tone" dropdown
- [ ] Verify options: Professional, Enthusiastic, Concise
- [ ] Select "Enthusiastic" tone
- [ ] Select "Length" dropdown
- [ ] Verify options: Short (~200-250 words), Standard (~300-400 words)
- [ ] Select "Short" length
- [ ] Generate cover letter
- [ ] Verify generated letter matches selected tone (more enthusiastic language)
- [ ] Verify generated letter is approximately 200-250 words (for Short)
- [ ] Change tone to "Concise" and length to "Standard"
- [ ] Click "Regenerate" button
- [ ] Verify new cover letter is more concise and longer (~300-400 words)

### 3. Cover Letter Editing

- [ ] Generate a cover letter
- [ ] Click in the cover letter textarea
- [ ] Edit the text (add/remove/modify content)
- [ ] Verify changes are saved in the textarea
- [ ] Verify edited content persists when switching between tabs/windows

### 4. Copy Functionality

- [ ] Generate a cover letter
- [ ] Click "Copy" button
- [ ] Verify button shows "Copied!" with checkmark icon
- [ ] Open a text editor (Notepad, Word, etc.)
- [ ] Paste (Ctrl+V)
- [ ] Verify cover letter content is pasted correctly
- [ ] Verify formatting is preserved (line breaks, paragraphs)

### 5. DOCX Download

- [ ] Generate a cover letter
- [ ] Click "Download .docx" button
- [ ] Verify file download starts
- [ ] Verify filename format: "Cover Letter - [Company] - [Role].docx" (if company/role provided)
- [ ] Open downloaded file in Microsoft Word or Google Docs
- [ ] Verify document structure:
  - [ ] Name and contact info at top (if provided)
  - [ ] Date
  - [ ] Company/role (if provided)
  - [ ] Cover letter body with proper paragraphs
  - [ ] Professional formatting
- [ ] Verify document is ATS-friendly (no complex formatting)

### 6. Save Cover Letter

- [ ] Generate a cover letter
- [ ] Optionally edit the content
- [ ] Click "Save Cover Letter" button
- [ ] Verify button shows "Saving..." with spinner
- [ ] Verify button shows "Saved!" with checkmark after successful save
- [ ] Verify success message appears (no error)
- [ ] Check database (optional - use Prisma Studio: `npx prisma studio`)
  - [ ] Verify CoverLetter record exists
  - [ ] Verify title, content, tone, length are saved correctly
  - [ ] Verify companyName and roleTitle are saved (if provided)

### 7. Regenerate Functionality

- [ ] Generate a cover letter
- [ ] Note the content
- [ ] Click "Regenerate" button
- [ ] Verify loading state appears
- [ ] Verify new cover letter is generated (different from previous)
- [ ] Verify tone and length settings are preserved
- [ ] Verify edited content is replaced (not merged)

### 8. Error Handling

- [ ] Try generating cover letter without resume text
- [ ] Verify error message appears
- [ ] Try generating cover letter without job description
- [ ] Verify error message appears
- [ ] Try generating with extremely long resume/job description (>40k chars)
- [ ] Verify appropriate error message appears
- [ ] Disconnect internet and try generating
- [ ] Verify error message about API failure appears

### 9. AI Provider Compatibility

#### Test with Gemini (if configured)
- [ ] Set `AI_PROVIDER="gemini"` in `.env`
- [ ] Restart server
- [ ] Generate cover letter
- [ ] Verify it works with Gemini API
- [ ] Verify cover letter quality is good

#### Test with OpenAI (if configured)
- [ ] Set `AI_PROVIDER="openai"` in `.env`
- [ ] Restart server
- [ ] Generate cover letter
- [ ] Verify it works with OpenAI API
- [ ] Verify cover letter quality is good

### 10. Integration with Optimize Flow

- [ ] Start fresh on Optimize page
- [ ] Enter resume and job description
- [ ] Generate optimization plan
- [ ] Verify cover letter section appears automatically
- [ ] Generate cover letter
- [ ] Verify both optimization plan and cover letter are visible
- [ ] Verify you can scroll between sections
- [ ] Verify layout is clean and organized

### 11. Optional Metadata

- [ ] In cover letter panel, verify optional fields can be provided:
  - [ ] Company name (if known)
  - [ ] Role title (if known)
  - [ ] Hiring manager name (if known)
  - [ ] User name (if known)
  - [ ] Contact info (if known)
- [ ] Generate cover letter with metadata
- [ ] Verify metadata is used in the generated letter
- [ ] Verify metadata appears in downloaded DOCX

### 12. Rate Limiting (if implemented)

- [ ] Generate 10+ cover letters rapidly
- [ ] Verify rate limiting kicks in after threshold
- [ ] Verify appropriate error message appears
- [ ] Wait 1 minute
- [ ] Verify you can generate again

## Expected Behavior Summary

✅ **Cover letter should:**
- Be highly specific to the job description
- Reference specific achievements from the resume
- Be ATS-friendly (plain text, no tables/symbols)
- Match selected tone and length
- Be editable by the user
- Download as properly formatted DOCX
- Save to database successfully

❌ **Cover letter should NOT:**
- Hallucinate company names, roles, or hiring managers
- Include tables, images, or fancy formatting
- Be generic or templated
- Exceed reasonable length limits
- Break the UI layout

## Troubleshooting

If tests fail:

1. **Check server logs** for API errors
2. **Verify environment variables** are set correctly
3. **Check database connection** (`npx prisma studio`)
4. **Verify AI API key** is valid and has credits
5. **Check browser console** for client-side errors
6. **Verify all dependencies** are installed (`npm install`)

## Notes

- Cover letters are generated server-side for security
- API keys are never exposed to the client
- Rate limiting is implemented to prevent abuse
- Cover letters can be saved without user authentication (userId is optional)
- DOCX export uses the `docx` library for proper formatting

