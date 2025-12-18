/**
 * Helper script to check available Gemini models
 * Run this to see which models your API key can access
 */

export async function checkAvailableGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Available Gemini models:');
      if (data.models) {
        data.models.forEach((model: any) => {
          console.log(`- ${model.name}`);
        });
      }
      return data.models;
    } else {
      const error = await response.text();
      console.error('Error checking models:', error);
    }
  } catch (error) {
    console.error('Failed to check models:', error);
  }
}

