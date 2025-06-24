import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(), // Genkit will automatically use Vertex AI if the environment (e.g., GOOGLE_CLOUD_PROJECT) is configured.
  ],
  // We will specify models in each flow to ensure the correct one is used for each task,
  // preventing accidental use of a powerful, expensive model for simple tasks.
});
