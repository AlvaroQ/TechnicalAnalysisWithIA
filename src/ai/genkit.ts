import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Validate that the API key is configured
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY no está configurada. Configure su API key en el archivo .env.local');
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
