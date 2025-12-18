# Resume Import Troubleshooting

## Current Status

The import feature supports:
- ✅ **JSON files** - Works perfectly (client-side)
- ⚠️ **PDF files** - Server-side parsing (may have issues)
- ⚠️ **DOCX files** - Server-side parsing (may have issues)

## Common Issues

### 500 Server Error

If you're getting a 500 error when importing PDF/DOCX files:

1. **Check server console logs** - The error details are now logged there
2. **Restart the dev server** - Changes to API routes require a restart
3. **Try a different file** - Some PDFs/DOCX files may be corrupted or have special encoding

### PDF Parsing Issues

PDF parsing uses the `pdf-parse` library which requires:
- Node.js runtime (configured in route)
- Buffer support (built-in to Node.js)

If PDF parsing fails:
- Check if the PDF is password-protected
- Ensure the PDF contains extractable text (not just images)
- Try converting the PDF to text manually first

### DOCX Parsing Issues

DOCX parsing uses the `mammoth` library which should work reliably.

If DOCX parsing fails:
- Ensure the file is a valid .docx (not .doc)
- Check if the file is corrupted
- Try opening it in Word and re-saving

## Alternative Solutions

If server-side parsing continues to fail, you can:

1. **Use JSON import** - Export your resume as JSON from another tool
2. **Convert to text first** - Copy-paste content manually
3. **Use a PDF to text converter** - Convert PDF to .txt and paste the text

## Testing

To test the import feature:

1. Start with a JSON file (should work)
2. Try a simple PDF with text (not scanned images)
3. Try a simple DOCX file

## Debugging

Check the browser console and server logs for detailed error messages. The improved error handling now provides:
- File name and size information
- Detailed error messages
- Stack traces for debugging

