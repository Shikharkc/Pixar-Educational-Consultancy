
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Send, NotebookPen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allEducationLevels, englishTestOptions, studyDestinationOptions, testPreparationOptions } from '@/lib/data.tsx';
import { addStudent } from '@/app/actions'; // Import the server action

// Schemas, Constants, and Submission functions are adapted for chatbot components.

// --- GENERAL CONTACT FORM LOGIC ---
const generalContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short."),
  lastCompletedEducation: z.string().min(1, "Please select your education level."),
  preferredStudyDestination: z.string().min(1, "Please select your preferred study destination."),
  additionalNotes: z.string().max(500, "Notes are too long.").optional(),
});
type GeneralContactFormValues = z.infer<typeof generalContactFormSchema>;


// --- PREP CLASS BOOKING FORM LOGIC ---
const preparationClassFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(7, "Phone number seems too short."),
  preferredTest: z.string().min(1, "Please select a test."),
  preferredStartDate: z.date().optional(),
});
type PreparationClassFormValues = z.infer<typeof preparationClassFormSchema>;
const PREP_CLASS_GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScOw8ztRBTL_iN0yRmszjlIUBPPDebd8fKIl4RcUZThZs9CSA/formResponse';
const PREP_CLASS_NAME_ENTRY_ID = 'entry.44402001';
const PREP_CLASS_EMAIL_ENTRY_ID = 'entry.1939269637';
const PREP_CLASS_PHONE_NUMBER_ENTRY_ID = 'entry.1784825660';
const PREP_CLASS_PREFERRED_TEST_ENTRY_ID = 'entry.418517897';
const PREP_CLASS_PREFERRED_START_DATE_ENTRY_ID = 'entry.894006407';
// Additional notes field exists in the main form, add a default here
const PREP_CLASS_ADDITIONAL_NOTES_ENTRY_ID = 'entry.1135205593';

async function submitToPrepClassGoogleSheet(data: PreparationClassFormValues) {
  const formData = new FormData();
  formData.append(PREP_CLASS_NAME_ENTRY_ID, data.name);
  formData.append(PREP_CLASS_EMAIL_ENTRY_ID, data.email);
  formData.append(PREP_CLASS_PHONE_NUMBER_ENTRY_ID, data.phoneNumber);
  formData.append(PREP_CLASS_PREFERRED_TEST_ENTRY_ID, data.preferredTest);
  if (data.preferredStartDate) {
    formData.append(PREP_CLASS_PREFERRED_START_DATE_ENTRY_ID, format(data.preferredStartDate, "yyyy-MM-dd"));
  }
  formData.append(PREP_CLASS_ADDITIONAL_NOTES_ENTRY_ID, 'Submitted via chatbot.');

  try {
    await fetch(PREP_CLASS_GOOGLE_FORM_ACTION_URL, { method: 'POST', body: formData, mode: 'no-cors' });
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Prep Class Google Sheet:', error);
    return { success: false };
  }
}

// --- REACT COMPONENTS ---

export function GeneralContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<GeneralContactFormValues>({
    resolver: zodResolver(generalContactFormSchema),
    defaultValues: { name: '', email: '', phoneNumber: '', lastCompletedEducation: '', preferredStudyDestination: '', additionalNotes: '' },
  });

  async function onSubmit(values: GeneralContactFormValues) {
    setIsSubmitting(true);
    // Add a default for englishProficiencyTest for the server action
    const dataToSend = { ...values, englishProficiencyTest: 'Not specified in chat' };
    const result = await addStudent(dataToSend);
    setIsSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      toast({ title: "Submission Error", description: result.message || "Could not send your inquiry. Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="w-full p-4 border rounded-lg bg-background shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Full Name</FormLabel><FormControl><Input className="h-8" placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Email</FormLabel><FormControl><Input className="h-8" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="phoneNumber" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Phone</FormLabel><FormControl><Input className="h-8" placeholder="+977..." {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="lastCompletedEducation" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Last Education</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select level" /></SelectTrigger></FormControl><SelectContent>{allEducationLevels.map(l => <SelectItem key={l.value} value={l.value}>{l.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
           <FormField control={form.control} name="preferredStudyDestination" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Destination</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select country" /></SelectTrigger></FormControl><SelectContent>{studyDestinationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="additionalNotes" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">Your Question</FormLabel><FormControl><Textarea className="text-sm" placeholder="Ask your question here..." rows={2} {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <Button type="submit" disabled={isSubmitting} className="w-full h-9">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send Inquiry
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function PrepClassBookingForm({ onSuccess }: { onSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm<PreparationClassFormValues>({
        resolver: zodResolver(preparationClassFormSchema),
        defaultValues: { name: '', email: '', phoneNumber: '', preferredTest: '', preferredStartDate: undefined },
    });

    async function onSubmit(values: PreparationClassFormValues) {
        setIsSubmitting(true);
        const result = await submitToPrepClassGoogleSheet(values);
        setIsSubmitting(false);
        if (result.success) {
            onSuccess();
        } else {
            toast({ title: "Submission Error", description: "Could not send your booking. Please try again.", variant: "destructive" });
        }
    }

    return (
        <div className="w-full p-4 border rounded-lg bg-background shadow-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Full Name</FormLabel><FormControl><Input className="h-8" placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Email</FormLabel><FormControl><Input className="h-8" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Phone</FormLabel><FormControl><Input className="h-8" placeholder="+977..." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="preferredTest" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Preferred Test</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Select a test" /></SelectTrigger></FormControl><SelectContent>{testPreparationOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="preferredStartDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel className="text-xs">Start Date (Optional)</FormLabel>
                            <Popover><PopoverTrigger asChild><FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-8", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1 )) } initialFocus /></PopoverContent>
                            </Popover><FormMessage />
                        </FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting} className="w-full h-9">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <NotebookPen className="mr-2 h-4 w-4" />}
                        Request Booking
                    </Button>
                </form>
            </Form>
        </div>
    );
}
