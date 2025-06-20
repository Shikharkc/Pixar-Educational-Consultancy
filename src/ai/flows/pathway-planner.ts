
// src/ai/flows/pathway-planner.ts
'use server';

/**
 * @fileOverview A pathway planner AI agent that suggests universities
 * based on a student's chosen country, desired field of study, GPA, and target education level.
 * It relies on its general knowledge and acts as if information is sourced from official university websites.
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
  gpa: z.string().describe('The student\'s approximate Grade Point Average (GPA) or academic standing (e.g., "4.0", "3.5-3.9", "Percentage-based equivalent"). The AI should consider this when suggesting suitable universities.'),
  targetEducationLevel: z.string().describe("The target level of education the student is seeking (e.g., Bachelor's Degree, Master's Degree)."),
});

export type PathwayPlannerInput = z.infer<typeof PathwayPlannerInputSchema>;

const UniversitySuggestionSchema = z.object({
  name: z.string().describe("The name of the suggested university."),
  category: z.string().describe("The main category or specialization of the university (e.g., Engineering, Arts, Business)."),
  logoDataAiHint: z.string().optional().describe("A 1-2 word hint for the university's logo for placeholder generation (e.g., 'university shield', 'modern building')."),
  website: z.string().describe("The official website URL of the university. Provide the most direct and commonly known official URL."),
  programDuration: z.string().describe("The typical duration for a relevant program in the field of study, e.g., '3-4 years', '18 months', '2 years full-time'."),
  type: z.enum(["Public", "Private", "Unknown"]).describe("The type of university (Public, Private, or Unknown)."),
  location: z.string().describe("The city and state/region of the university (e.g., 'Cambridge, MA', 'Sydney, NSW')."),
  tuitionCategory: z.enum(["Affordable", "Mid-Range", "Premium", "Varies", "Unknown"]).describe("A category for the estimated annual tuition. Affordable: typically <$15,000 USD/year or equivalent. Mid-Range: $15,000-$30,000 USD/year or equivalent. Premium: >$30,000 USD/year or equivalent. Use 'Varies' if it's highly variable or 'Unknown' if not determinable."),
  tuitionFeeRange: z.string().optional().describe("ONLY the estimated annual tuition fee range if available based on general knowledge, e.g., '$10,000 - $15,000 USD' OR '€8,000 - €12,000'. Do NOT include any additional sentences, explanations, or disclaimers. Strictly the fee range. If unknown, omit this field."),
  englishTestRequirements: z.string().optional().describe("CONCISE typical English proficiency test scores required (e.g., 'IELTS: 6.5+', 'TOEFL iBT: 90+'). Keep this information brief, based on general knowledge. If unknown, omit this field."),
  nextIntakeDate: z.string().optional().describe("CONCISE typical next intake period or application deadline information, e.g., 'Fall 2025 (Apply by Jan 2025)', 'Rolling Admissions', 'Intakes: Jan, May, Sep'. Be CONCISE. Provide this if commonly known. If unknown, omit this field."),
});

const PathwayPlannerOutputSchema = z.object({
  universitySuggestions: z
    .array(UniversitySuggestionSchema)
    .describe('A list of suggested universities with their details, relevant to the chosen country, field of study, GPA, and target education level. These suggestions are based on general knowledge and common information about universities.'),
  searchSummary: z.string().optional().describe("A brief summary of the search results or any general advice based on the query. For example, 'Here are some leading Engineering universities in the USA known for strong research programs that might be suitable for a student with a {{{gpa}}} GPA seeking a {{{targetEducationLevel}}}.' Acknowledge the GPA's and target education level's influence if relevant."),
});

export type PathwayPlannerOutput = z.infer<typeof PathwayPlannerOutputSchema>;

export async function pathwayPlanner(input: PathwayPlannerInput): Promise<PathwayPlannerOutput> {
  return pathwayPlannerFlow(input);
}

const pathwayPlannerPrompt = ai.definePrompt({
  name: 'pathwayPlannerPrompt',
  input: {schema: PathwayPlannerInputSchema},
  output: {schema: PathwayPlannerOutputSchema},
  prompt: `You are an expert educational consultant with a vast knowledge base about universities worldwide. Your goal is to provide students with relevant university suggestions as if you are referencing official university information, but without actually accessing external websites or real-time data. Rely on your training data.

  A student is seeking university suggestions based on their desired country ('{{{country}}}'), field of study ('{{{fieldOfStudy}}}'), GPA ('{{{gpa}}}'), and target education level ('{{{targetEducationLevel}}}').

  IMPORTANT INSTRUCTIONS:
  1.  **Knowledge Base**: Base your suggestions on generally known information about universities, their programs, typical requirements, and reputations.
  2.  **Official Tone**: Frame your responses as if the information is derived from reliable sources like university websites, but do not claim to have accessed them in real-time.
  3.  **Accuracy Focus**: Prioritize information that is commonly known and widely accepted about institutions. For details like tuition fees or intake dates, provide estimates or typical ranges if generally known; otherwise, it's better to omit the specific field or use "Unknown"/"Varies" for categories. Do NOT invent specific numbers if they are not part of your general knowledge.
  4.  **GPA and Level Consideration**: Consider the student's GPA ('{{{gpa}}}') and their target education level ('{{{targetEducationLevel}}}') when suggesting universities. Aim for institutions where a student with this academic standing might generally be competitive for programs at their desired level.
  5.  **Diversity of Suggestions**: Provide a DIVERSE range of suitable universities. While you can include well-known institutions, also make an effort to suggest other strong universities that might be excellent fits but perhaps less globally famous. The goal is to offer a broad spectrum of choices relevant to the student's criteria.
  6.  **Website Links**: For each university, provide the most common, official website URL.

  For each university suggestion, provide the following details strictly adhering to the output schema:
  - 'name': The official name of the university.
  - 'category': The main academic category or specialization relevant to the field of study.
  - 'logoDataAiHint': A very short (1-2 words) hint for a placeholder logo.
  - 'website': The official website URL.
  - 'programDuration': Typical duration for a relevant program at the target education level.
  - 'type': "Public", "Private", or "Unknown".
  - 'location': City and state/region.
  - 'tuitionCategory': "Affordable", "Mid-Range", "Premium", "Varies", or "Unknown".
  - 'tuitionFeeRange': (Optional) ONLY the estimated annual tuition range if commonly known, e.g., '$10,000 - $15,000 USD'. No extra text.
  - 'englishTestRequirements': (Optional) CONCISE typical scores if commonly known, e.g., "IELTS: 6.5+".
  - 'nextIntakeDate': (Optional) CONCISE typical intake info if commonly known, e.g., "Fall 2025 (Apply by Jan 2025)".

  Only list universities located within the specified country ('{{{country}}}').
  Provide as many relevant suggestions as you can find for the given criteria based on your knowledge.

  Student's Query:
  - Desired Country: {{{country}}}
  - Desired Field of Study: {{{fieldOfStudy}}}
  - Student's GPA/Academic Standing: {{{gpa}}}
  - Student's Target Education Level: {{{targetEducationLevel}}}

  Finally, include a brief 'searchSummary' if you have any overarching comments on the results for the given query. Acknowledge the GPA's and target education level's influence on university suitability in your summary if relevant.
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
    if (!output) {
      throw new Error(`AI model did not return the expected output for ${pathwayPlannerPrompt.name}. Output was null or undefined.`);
    }
    return output;
  }
);
