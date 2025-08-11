'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/pathway-planner.ts';
import '@/ai/flows/chatbot-flow.ts'; // Add chatbot flow

// english-test-advisor.ts and sop-generator-flow.ts have been removed as they are obsolete.
