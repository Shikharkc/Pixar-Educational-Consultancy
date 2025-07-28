/**
 * @fileOverview Schemas and types for the chatbot functionality.
 * This file defines the data structures used for chat inputs and outputs.
 */

import { z } from 'zod';

// Input schema for the chat function
export const ChatInputSchema = z.object({
  context: z.string().describe('The relevant context from the website pages the user might be looking at.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
  query: z.string().describe('The user\'s latest query or question.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Output schema for the chat function
export const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user query.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
