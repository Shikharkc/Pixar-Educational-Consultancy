
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase-admin'; // Using admin SDK for backend operations
import { FieldValue } from 'firebase-admin/firestore';

// Zod schema for server-side validation
const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short.").max(15, "Phone number is too long.").regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format."),
  lastCompletedEducation: z.string().min(1, "Please select your education level."),
  englishProficiencyTest: z.string().min(1, "Please select an option for English proficiency test."),
  preferredStudyDestination: z.string().min(1, "Please select your preferred study destination."),
  additionalNotes: z.string().max(500, "Additional notes are too long.").optional(),
});

type GeneralContactFormValues = z.infer<typeof studentSchema>;

export async function addStudent(data: GeneralContactFormValues) {
  try {
    // Validate the data on the server
    const validatedData = studentSchema.safeParse(data);

    if (!validatedData.success) {
      console.error('Server-side validation failed:', validatedData.error.flatten().fieldErrors);
      return { success: false, message: 'Invalid data provided. Please check your entries.' };
    }

    const studentData = {
      fullName: validatedData.data.name,
      email: validatedData.data.email,
      mobileNumber: validatedData.data.phoneNumber,
      lastCompletedEducation: validatedData.data.lastCompletedEducation,
      englishProficiencyTest: validatedData.data.englishProficiencyTest,
      preferredStudyDestination: validatedData.data.preferredStudyDestination,
      additionalNotes: validatedData.data.additionalNotes || '',
      // Add a searchableName field for case-insensitive search in admin panel
      searchableName: validatedData.data.name.toLowerCase(), 
      // Set default values for fields not in the contact form
      visaStatus: 'Not Applied' as const,
      serviceFeeStatus: 'Unpaid' as const,
      assignedTo: 'Unassigned',
      timestamp: FieldValue.serverTimestamp(),
      serviceFeePaidDate: null,
      visaStatusUpdateDate: null,
      emergencyContact: '',
      collegeUniversityName: '',
    };
    
    // Using the Admin SDK to write to Firestore
    await db.collection('students').add(studentData);
    
    return { success: true, message: "Your message has been sent successfully! We'll get back to you soon." };
  } catch (error) {
    console.error('Error writing to Firestore with Admin SDK:', error);
    // Return a generic error message to the user
    return { success: false, message: 'An error occurred while sending your message. Please try again or contact us directly.' };
  }
}
