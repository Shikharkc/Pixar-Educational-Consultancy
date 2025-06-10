// src/ai/flows/pathway-planner.ts
'use server';

/**
 * @fileOverview A pathway planner AI agent that suggests universities
 * based on a student's chosen country and desired field of study.
 *
 * - pathwayPlanner - A function that handles the pathway planning process.
 * - PathwayPlannerInput - The input type for the pathwayPlanner function.
 * - PathwayPlannerOutput - The return type for the pathwayPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PathwayPlannerInputSchema = z.object({
  country: z
    .string()
    .describe('The country the student is interested in (e.g., USA, Australia).'),
  fieldOfStudy: z.string().describe('The desired field of study (e.g., computer science, engineering).'),
});

export type PathwayPlannerInput = z.infer<typeof PathwayPlannerInputSchema>;

const PathwayPlannerOutputSchema = z.object({
  universitySuggestions: z
    .array(z.object({
      name: z.string().describe("The name of the suggested university."),
      category: z.string().describe("The main category or specialization of the university (e.g., Engineering, Arts, Business).")
    }))
    .describe('A list of suggested universities with their names and main categories, relevant to the chosen country and field of study.'),
});

export type PathwayPlannerOutput = z.infer<typeof PathwayPlannerOutputSchema>;

export async function pathwayPlanner(input: PathwayPlannerInput): Promise<PathwayPlannerOutput> {
  return pathwayPlannerFlow(input);
}

const pathwayPlannerPrompt = ai.definePrompt({
  name: 'pathwayPlannerPrompt',
  input: {schema: PathwayPlannerInputSchema},
  output: {schema: PathwayPlannerOutputSchema},
  prompt: `You are an expert educational consultant. A student is seeking university suggestions.
  Based on their desired country and field of study, provide a list of university suggestions.
  Each suggestion must include the university name and its primary category or area of specialization relevant to the field of study.
  Only list universities located within the specified country.

  Country: {{{country}}}
  Field of Study: {{{fieldOfStudy}}}
  `,
});

const pathwayPlannerFlow = ai.defineFlow(
  {
    name: 'pathwayPlannerFlow',
    inputSchema: PathwayPlannerInputSchema,
    outputSchema: PathwayPlannerOutputSchema,
  },
  async input => {
    const {output} = await pathwayPlannerPrompt(input);
    return output!;
  }
);
