# Resume Builder - Implementation Guide

## Overview

The new Resume Builder follows a Resume-Now-style flow: choose a template → guided editor with smart suggestions → live preview → export PDF/JSON.

## Architecture

### Framework Integration
- **Next.js 14** with App Router
- **React** with hooks (useState, useEffect, useCallback)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** (shadcn/ui) components

### Key Files Created

#### Data Model & Types
- `types/resume.ts` - Complete Resume type definitions with all sections

#### Storage & Persistence
- `lib/resume-storage.ts` - localStorage utilities with auto-save, import/export
- Auto-saves to localStorage every 1 second after changes

#### Smart Suggestions
- `data/phrases.ts` - Phrase library organized by job families (10 categories)
- `lib/bullet-rewriter.ts` - Rule-based bullet strengthening
- `lib/keyword-extractor.ts` - Keyword extraction reusing ATS logic

#### Templates
- `components/resume/templates/template-base.tsx` - Base template component
- `components/resume/templates/*.tsx` - 5 templates (Minimal, Modern, Classic, Compact, Bold)
- `components/resume/template-renderer.tsx` - Template router

#### Editors
- `components/resume/editors/contact-editor.tsx` - Contact information
- `components/resume/editors/summary-editor.tsx` - Professional summary
- `components/resume/editors/experience-editor.tsx` - Work experience with smart suggestions
- `components/resume/editors/education-editor.tsx` - Education
- `components/resume/editors/skills-editor.tsx` - Skills with categories
- `components/resume/editors/projects-editor.tsx` - Projects
- `components/resume/editors/certifications-editor.tsx` - Certifications
- `components/resume/editors/additional-editor.tsx` - Custom sections

#### Main Builder
- `app/resume-builder/page.tsx` - Main builder page with split-pane layout
- `components/resume/tailor-to-jd.tsx` - JD tailoring panel

#### Export
- `lib/resume-export-new.ts` - PDF export using jsPDF

## Features Implemented

### ✅ Core Features
1. **Template Selection** - 5 professional templates
2. **Step-by-Step Editor** - 8 sections with guided inputs
3. **Live Preview** - Real-time preview matching export
4. **Smart Suggestions** - Job family-based bullet suggestions
5. **Bullet Rewriter** - Strengthen weak bullets automatically
6. **Tailor to JD** - Integrates with existing ATS keyword extraction
7. **PDF Export** - Multi-page PDF generation
8. **JSON Export/Import** - Full resume serialization
9. **Auto-save** - Debounced localStorage persistence
10. **No Auth Required** - Works completely anonymously

### ✅ Experience Editor Features
- Add/edit multiple work experiences
- Bullet points with drag-and-drop structure (ready for enhancement)
- Smart suggestions based on job title
- Bullet strengthener (weak → strong verbs)
- Quick insert suggestions
- Current position toggle

### ✅ JD Tailoring
- Paste job description
- Extract keywords using existing ATS logic
- Show matched/missing keywords
- Add missing keywords to skills with one click
- Keyword density warnings
- Integrates with existing `/api/match` endpoint

## Usage

### Starting a New Resume
1. Navigate to `/resume-builder`
2. Click "Start New Resume"
3. Choose a template from dropdown
4. Fill sections using the stepper navigation

### Using Smart Suggestions
1. Go to Experience section
2. Enter a job title in "Get Smart Suggestions" box
3. Click sparkle icon to load suggestions
4. Click any suggestion to insert as a bullet
5. Use strengthen button (✨) on weak bullets

### Tailoring to Job Description
1. Scroll to "Tailor to JD" panel at bottom
2. Paste job description
3. Click "Analyze Keywords"
4. Review matched/missing keywords
5. Click "Add Missing Keywords to Skills" if needed

### Exporting
- **PDF**: Click download icon in header → Downloads as `{Name}_Resume.pdf`
- **JSON**: Click file icon in header → Downloads as `{Name}.json`

### Importing
- Click "Import Resume JSON" on landing page
- Select a JSON file exported from the builder
- Resume loads with all data

## Adding New Templates

1. Create a new file in `components/resume/templates/`
2. Export a component that wraps `TemplateBase` with custom styling
3. Add to `TEMPLATE_OPTIONS` in `template-renderer.tsx`

Example:
```tsx
export function MyTemplate({ resume }: { resume: Resume }) {
  return (
    <TemplateBase
      resume={resume}
      className="my-template bg-white p-10 max-w-4xl mx-auto"
    />
  )
}
```

## Adding New Phrases

Edit `data/phrases.ts`:
1. Add new job family to `JobFamily` type (if needed)
2. Add entry to `PHRASE_LIBRARY` with actionVerbs, bulletTemplates, atsKeywords
3. Update `inferJobFamily` function to recognize the new family

## Testing Checklist

- [ ] Create new resume from scratch
- [ ] Fill all sections with sample data
- [ ] Switch between templates and verify preview updates
- [ ] Use smart suggestions in experience section
- [ ] Strengthen a weak bullet point
- [ ] Tailor resume to a job description
- [ ] Export as PDF and verify formatting
- [ ] Export as JSON, then import it back
- [ ] Verify auto-save works (check localStorage)
- [ ] Test on mobile/tablet (responsive design)

## Performance Notes

- Preview uses React memoization to avoid re-rendering on every keystroke
- Auto-save is debounced to 1 second
- Template rendering is optimized with conditional rendering

## Future Enhancements

- Drag-and-drop bullet reordering
- More sophisticated bullet suggestion engine
- Template customization (colors, fonts)
- Resume versioning/history
- Cloud sync for logged-in users
- DOCX export (if needed)
- ATS compatibility checker integration

## Troubleshooting

**Preview not updating?**
- Check browser console for errors
- Verify resume state is updating correctly

**Export not working?**
- Ensure jsPDF is installed: `npm install jspdf`
- Check browser console for errors

**Suggestions not loading?**
- Verify job title is entered
- Check `data/phrases.ts` has entries for inferred job family

**Keywords not extracting?**
- Verify AI provider is configured correctly
- Check `/api/match` endpoint is working
- Falls back to simple extraction if AI fails

