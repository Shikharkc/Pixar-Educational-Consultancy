
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SectionTitle from '@/components/ui/section-title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// AI flow import removed for document checklist: import { generateDocumentChecklist, type DocumentChecklistInput, type DocumentChecklistOutput } from '@/ai/flows/document-checklist-flow';

import { Loader2, Sparkles, Info, FileText, Download, AlertCircle, BookOpenText, ListChecks, MessageSquare, HelpCircle, CheckCircle as CheckCircleIcon, User } from 'lucide-react';

// Schemas for English Test Advisor
const englishTestFormSchema = z.object({
  currentLevel: z.string().min(1, "Please select your current English level."),
  timeline: z.string().min(1, "Please select your timeline."),
  budget: z.string().min(1, "Please select your budget in NPR."),
  purpose: z.string().min(1, "Please state the purpose for the test.").max(200, "Purpose too long"),
});
type EnglishTestAdvisorFormValues = z.infer<typeof englishTestFormSchema>;

interface RuleBasedEnglishTestOutput {
  testRecommendation: string;
  reasoning: string;
  badges?: string[];
}

// Schemas for Document Checklist
const docChecklistFormSchema = z.object({
  userName: z.string().min(2, "Please enter your full name.").max(100, "Name is too long."),
  educationLevel: z.string().min(1, "Please select your education level."),
  desiredCountry: z.string().min(1, "Please select your desired country."),
});
type DocumentChecklistFormValues = z.infer<typeof docChecklistFormSchema>;

// --- START: Static Data for Rule-Based Document Checklist ---
interface StaticDocument {
  englishName: string;
  nepaliName: string;
  description: string;
  educationLevels?: string[]; // e.g., ["Bachelor's Degree", "Master's Degree"] - if undefined, applies to all
  countries?: string[]; // e.g., ["USA", "Australia"] - if undefined, applies to all
}

interface RuleBasedDocumentChecklistOutput {
  checklist: StaticDocument[];
  notes?: string;
}

const allEducationLevels = [
  "High School Diploma or Equivalent (e.g., +2, A-Levels)",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
];

const generalDocuments: StaticDocument[] = [
  { englishName: "Passport", nepaliName: "राहदानी", description: "Valid passport with sufficient validity (usually at least 6 months beyond intended stay)." },
  { englishName: "Academic Transcripts & Certificates", nepaliName: "शैक्षिक प्रमाणपत्र र ट्रान्सक्रिप्टहरू", description: "Official transcripts and completion certificates from all previous educational institutions (e.g., SLC/SEE, +2, Bachelor's, Master's)." },
  { englishName: "English Proficiency Test Score", nepaliName: "अंग्रेजी भाषा प्रवीणता परीक्षा स्कोर", description: "Valid score report from IELTS, TOEFL, PTE, or Duolingo, as required by the institution and country. (e.g. IELTS: 6.0-7.5, TOEFL: 80-100)." },
  { englishName: "Statement of Purpose (SOP) / Letter of Intent", nepaliName: "उद्देश्यको कथन / आशय पत्र", description: "An essay outlining your academic background, career goals, reasons for choosing the course and institution, and future plans." },
  { englishName: "Letters of Recommendation (LORs)", nepaliName: "सिफारिश पत्रहरू", description: "Usually 2-3 letters from professors or employers who can attest to your academic abilities and character.", educationLevels: ["Bachelor's Degree", "Master's Degree", "Doctorate (PhD)"] },
  { englishName: "Curriculum Vitae (CV) / Resume", nepaliName: "बायोडाटा / रिजुमे", description: "A summary of your academic qualifications, work experience, skills, and achievements.", educationLevels: ["Master's Degree", "Doctorate (PhD)"] },
  { englishName: "Financial Documents", nepaliName: "वित्तीय कागजातहरू", description: "Proof of sufficient funds to cover tuition fees and living expenses (e.g., bank statements, education loan sanction letter, scholarship letter)." },
  { englishName: "Visa Application Form", nepaliName: "भिसा आवेदन फारम", description: "Completed and signed visa application form for the specific country." },
  { englishName: "Passport-size Photographs", nepaliName: "पासपोर्ट आकारको फोटोहरू", description: "Recent photographs meeting the specific requirements of the country and institution." },
  { englishName: "Birth Certificate", nepaliName: "जन्म दर्ता प्रमाणपत्र", description: "Official birth certificate, sometimes required for verification." },
  { englishName: "Police Clearance Certificate", nepaliName: "पुलिस क्लियरेन्स प्रमाणपत्र", description: "A certificate from the police indicating no criminal record, required by some countries.", countries: ["Australia", "Canada", "New Zealand"] },
  { englishName: "Health Examination / Medical Certificate", nepaliName: "स्वास्थ्य परीक्षण / मेडिकल प्रमाणपत्र", description: "Proof of medical examination, required by some countries for visa purposes.", countries: ["Australia", "Canada", "New Zealand"] },
];

const countrySpecificNotes: Record<string, string> = {
  "USA": "For the USA, the I-20 form from your university is crucial for the F-1 visa application. Also, prepare for the SEVIS fee payment and a visa interview. Financial documentation needs to be robust.",
  "Australia": "Australia requires a Genuine Temporary Entrant (GTE) statement and Overseas Student Health Cover (OSHC). Ensure your financial documents clearly show the source of funds.",
  "Canada": "For Canada, you'll need an acceptance letter from a Designated Learning Institution (DLI). Biometrics and a medical exam might be required. A Guaranteed Investment Certificate (GIC) is a common way to show proof of funds for some programs.",
  "UK": "The UK requires a Confirmation of Acceptance for Studies (CAS) from your university. You'll need to show funds for tuition and living costs, and may need an IELTS UKVI test.",
  "New Zealand": "New Zealand emphasizes that you are a genuine student and have sufficient funds. Health and character checks are important.",
};

function getRuleBasedDocumentChecklist(input: { educationLevel: string; desiredCountry: string }): RuleBasedDocumentChecklistOutput {
  const { educationLevel, desiredCountry } = input;

  let filteredDocuments = generalDocuments.filter(doc => {
    const educationMatch = !doc.educationLevels || doc.educationLevels.includes(educationLevel);
    const countryMatch = !doc.countries || doc.countries.includes(desiredCountry);
    return educationMatch && countryMatch;
  });

  // Basic sorting: documents applicable to all first, then country/edu specific
  filteredDocuments.sort((a, b) => {
      const aSpecificity = (a.countries ? 1 : 0) + (a.educationLevels ? 1 : 0);
      const bSpecificity = (b.countries ? 1 : 0) + (b.educationLevels ? 1 : 0);
      return aSpecificity - bSpecificity;
  });


  let notes = "This is a general checklist. Requirements can vary significantly based on the specific institution, program, and your individual circumstances. Always verify the exact requirements with the university and the respective country's immigration authorities. \n\nLanguage proficiency tests like IELTS, TOEFL, or PTE are almost always required; aim for competitive scores. Ensure all documents are genuine, and if not in English, provide certified translations (except for Nepali names).";
  if (countrySpecificNotes[desiredCountry]) {
    notes += `\n\nSpecific advice for ${desiredCountry}: ${countrySpecificNotes[desiredCountry]}`;
  }
  notes += "\n\nPixar Educational Consultancy can provide personalized assistance with your documentation. Contact us for detailed guidance!"


  return {
    checklist: filteredDocuments,
    notes: notes,
  };
}
// --- END: Static Data for Rule-Based Document Checklist ---

const selectableCountries = [
  { name: 'Australia', value: 'Australia' },
  { name: 'Canada', value: 'Canada' },
  { name: 'USA', value: 'USA' },
  { name: 'UK', value: 'UK' },
  { name: 'New Zealand', value: 'New Zealand' },
];

const testComparisonData = [
  { name: "IELTS Academic", cost: "~$250 USD / ~Rs. 33,000", typicalDuration: "2h 45m", acceptance: "Very High (Academia, Immigration globally)", format: "Paper or Computer", resultTime: "3-13 days", keyFeatures: ["Face-to-face speaking test option", "Widely available test centers"] },
  { name: "TOEFL iBT", cost: "~$245 USD / ~Rs. 32,500", typicalDuration: "~3 hours", acceptance: "Very High (Especially US Academia)", format: "Computer-based", resultTime: "4-8 days", keyFeatures: ["Strong academic focus", "Integrated tasks simulating university environment"] },
  { name: "PTE Academic", cost: "~$220 USD / ~Rs. 29,000", typicalDuration: "2 hours", acceptance: "High (Academia, Immigration in Australia, NZ, UK)", format: "Computer-based, AI scored", resultTime: "Typically 2-5 days", keyFeatures: ["Fast results", "Fully computer-scored including speaking"] },
  { name: "Duolingo English Test", cost: "~$59 USD / ~Rs. 7,800", typicalDuration: "~1 hour (including setup)", acceptance: "Growing (Many US universities, some others)", format: "Computer-adaptive, at-home", resultTime: "Within 2 days", keyFeatures: ["Affordable and accessible", "Can be taken online anytime"] }
];


export default function SmartToolsPage() {
  // State for English Test Advisor
  const [isEnglishTestLoading, setIsEnglishTestLoading] = useState(false);
  const [englishTestError, setEnglishTestError] = useState<string | null>(null);
  const [englishTestResult, setEnglishTestResult] = useState<RuleBasedEnglishTestOutput | null>(null);
  const [showEnglishTestResultsArea, setShowEnglishTestResultsArea] = useState(false);
  const [englishTestResultsAnimatedIn, setEnglishTestResultsAnimatedIn] = useState(false);

  // State for Document Checklist
  const [isDocChecklistLoading, setIsDocChecklistLoading] = useState(false);
  const [docChecklistError, setDocChecklistError] = useState<string | null>(null);
  const [docChecklistResult, setDocChecklistResult] = useState<RuleBasedDocumentChecklistOutput | null>(null); // Updated type
  const [showDocChecklistResultsArea, setShowDocChecklistResultsArea] = useState(false);
  const [docChecklistResultsAnimatedIn, setDocChecklistResultsAnimatedIn] = useState(false);

  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsRef, isTabsVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });


  const englishTestForm = useForm<EnglishTestAdvisorFormValues>({
    resolver: zodResolver(englishTestFormSchema),
    defaultValues: {
      currentLevel: '',
      timeline: '',
      budget: '',
      purpose: '',
    },
  });

  const docChecklistForm = useForm<DocumentChecklistFormValues>({
    resolver: zodResolver(docChecklistFormSchema),
    defaultValues: {
      userName: '',
      educationLevel: '',
      desiredCountry: '',
    },
  });

  function getRuleBasedEnglishTestRecommendation(values: EnglishTestAdvisorFormValues): RuleBasedEnglishTestOutput {
    const { currentLevel, timeline, budget, purpose } = values;
    let recommendation: RuleBasedEnglishTestOutput = {
      testRecommendation: "IELTS Academic",
      reasoning: "IELTS Academic is widely accepted for university admissions and immigration globally. It offers both paper and computer-based formats. For dedicated preparation, Pixar Educational Consultancy provides excellent classes. For more detailed guidance, please contact an advisor.",
      badges: ["Widely Accepted", "Versatile"]
    };

    const purposeLower = purpose.toLowerCase();

    if (budget === "< NPR 15000" || timeline === "1 month") {
      recommendation = {
        testRecommendation: "Duolingo English Test",
        reasoning: "The Duolingo English Test is affordable and offers quick results, making it suitable for tighter budgets and timelines. It's increasingly accepted by many universities. Pixar Educational Consultancy has resources to help you prepare. Contact us for more personalized advice!",
        badges: ["Affordable", "Quick Results", "Online Convenience"]
      };
    } else if (purposeLower.includes("usa") && (currentLevel === "advanced" || currentLevel === "intermediate")) {
      recommendation = {
        testRecommendation: "TOEFL iBT",
        reasoning: "TOEFL iBT is highly favored by US universities due to its academic focus. It's ideal if you're aiming for institutions in the USA. Pixar Educational Consultancy offers excellent TOEFL preparation classes. Speak to an advisor for tailored support.",
        badges: ["Good for USA", "Academic Focus"]
      };
    } else if (purposeLower.includes("australia") || purposeLower.includes("nz") || purposeLower.includes("uk") && timeline !== "1 month") {
       recommendation = {
        testRecommendation: "PTE Academic",
        reasoning: "PTE Academic is a computer-based test known for fast results and is widely accepted in Australia, NZ, and the UK. Its AI scoring can be beneficial. Pixar Educational Consultancy provides comprehensive PTE coaching. Get in touch for expert guidance.",
        badges: ["Fast Results", "Computer Scored", "Good for Aus/NZ/UK"]
      };
    } else if (currentLevel === "beginner" && budget !== "> NPR 45000") {
       recommendation = {
        testRecommendation: "Duolingo English Test / PTE Academic",
        reasoning: "For beginners, Duolingo offers a more accessible entry point due to its adaptive nature and lower cost. PTE Academic can also be considered as you progress. Pixar Educational Consultancy can help you build your foundational skills and prepare effectively. Contact us to discuss your learning plan.",
        badges: ["Good for Beginners", "Adaptive (Duolingo)"]
      };
    } else {
      recommendation = {
        testRecommendation: "IELTS Academic",
        reasoning: `IELTS Academic is broadly accepted for studies worldwide, including in ${values.purpose.includes("USA") ? "the USA, " : ""} ${values.purpose.includes("Canada") ? "Canada, " : ""} ${values.purpose.includes("UK") ? "the UK, " : ""} and ${values.purpose.includes("Australia") ? "Australia" : "many other countries"}. It suits various proficiency levels. Pixar Educational Consultancy has excellent IELTS preparation programs. Talk to an advisor for more details!`,
        badges: ["Globally Recognized", "Versatile Format Options"]
      };
    }
    
    recommendation.reasoning += "\n\nFor dedicated preparation for any English test, Pixar Educational Consultancy offers excellent classes. You can get more personalized advice by contacting one of our advisors.";

    return recommendation;
  }

  async function onEnglishTestSubmit(values: EnglishTestAdvisorFormValues) {
    setEnglishTestResult(null);
    setEnglishTestError(null);

    if (!showEnglishTestResultsArea) {
      setShowEnglishTestResultsArea(true);
      requestAnimationFrame(() => {
          setEnglishTestResultsAnimatedIn(true);
      });
    }
    setIsEnglishTestLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const ruleBasedResult = getRuleBasedEnglishTestRecommendation(values);
      setEnglishTestResult(ruleBasedResult);
    } catch (e) {
      setEnglishTestError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsEnglishTestLoading(false);
    }
  }

  async function onDocChecklistSubmit(values: DocumentChecklistFormValues) {
    setDocChecklistResult(null);
    setDocChecklistError(null);

    if (!showDocChecklistResultsArea) {
        setShowDocChecklistResultsArea(true);
        requestAnimationFrame(() => {
            setDocChecklistResultsAnimatedIn(true);
        });
    }
    setIsDocChecklistLoading(true);
    // Simulate a short delay for UX, as AI call is removed
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const ruleBasedResult = getRuleBasedDocumentChecklist({
        educationLevel: values.educationLevel,
        desiredCountry: values.desiredCountry,
      });
      setDocChecklistResult(ruleBasedResult);
    } catch (e) {
      setDocChecklistError(e instanceof Error ? e.message : 'An unexpected error occurred generating the checklist.');
    } finally {
      setIsDocChecklistLoading(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!docChecklistResult || !docChecklistResult.checklist) return;
    const userName = docChecklistForm.getValues('userName');
    const doc = new jsPDF();
    const logoSrc = '/logo.png'; // Ensure this logo exists in your /public folder

    // Function to add header, footer, and watermark to each page
    const addPageElementsAndWatermark = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      // Watermark (Pixar Edu Logo)
      const watermarkWidth = 80; // Adjust as needed
      const watermarkHeight = 80; // Adjust as needed
      const watermarkX = (pageWidth - watermarkWidth) / 2;
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      try {
        // Attempt to add image. If it fails, add text watermark.
        doc.addImage(logoSrc, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight, undefined, 'FAST');
      } catch (e) {
        console.warn("Watermark image could not be added. Ensure " + logoSrc + " exists in /public. Adding text watermark instead. Error: ", e);
        // Text watermark as fallback
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200); // Light grey color
        doc.text("Pixar Edu", pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
        doc.setTextColor(0, 0, 0); // Reset text color
      }


      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Pixar Educational Consultancy", pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.textWithLink("www.pixaredu.com", pageWidth / 2, 23, { align: 'center', url: 'https://www.pixaredu.com'});


      // Line separator
      doc.setLineWidth(0.5);
      doc.line(14, 30, pageWidth - 14, 30); // from x1, y1, to x2, y2
    };
    
    let currentY = 35; // Start content below header

    const startNewPage = () => {
      doc.addPage();
      addPageElementsAndWatermark();
      currentY = 35; // Reset Y for new page
    };

    addPageElementsAndWatermark(); // Add elements to the first page

    // Checklist Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Document Checklist for ${userName}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 10;

    // User Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Education Level: ${docChecklistForm.getValues('educationLevel')}`, 14, currentY);
    currentY += 6;
    doc.text(`Desired Country: ${docChecklistForm.getValues('desiredCountry')}`, 14, currentY);
    currentY += 10;

    // Checklist Items
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Document Checklist:", 14, currentY);
    currentY += 7;

    docChecklistResult.checklist.forEach((item, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Prepare text parts
      const itemNumberText = `${index + 1}. `;
      const englishNameText = item.englishName;
      // Nepali name will be omitted from PDF as per previous logic for AI flow
      const fullItemText = itemNumberText + englishNameText;

      // Calculate height for item name
      const itemNameLines = doc.splitTextToSize(fullItemText, doc.internal.pageSize.getWidth() - 28); // 14 margin left, 14 margin right
      const itemNameHeight = itemNameLines.length * 4.5; // Approximate line height

      // Calculate height for description
      const descriptionLines = doc.splitTextToSize(`   Description: ${item.description}`, doc.internal.pageSize.getWidth() - 32); // Indented description
      const descriptionHeight = descriptionLines.length * 4.5;

      const totalItemHeight = itemNameHeight + descriptionHeight + 3; // +3 for spacing

      // Check if new page is needed
      if (currentY + totalItemHeight > doc.internal.pageSize.getHeight() - 20) { // 20 for bottom margin
        startNewPage();
        // Add continued title if needed
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Document Checklist (Continued):", 14, currentY);
        currentY += 7;
      }
      
      // Add item name
      doc.text(itemNameLines, 14, currentY);
      currentY += itemNameHeight;

      // Add description
      doc.text(descriptionLines, 14, currentY); // Indent description slightly
      currentY += descriptionHeight + 3; // Add some space after description
    });

    // Notes section
    if (docChecklistResult.notes) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const notesTitle = "Important Notes & Advice:";
      const notesTitleHeight = 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(docChecklistResult.notes, doc.internal.pageSize.getWidth() - 28);
      const notesBodyHeight = notesLines.length * 4.5;
      const totalNotesHeight = notesTitleHeight + notesBodyHeight;

      if (currentY + totalNotesHeight > doc.internal.pageSize.getHeight() - 20) {
        startNewPage();
      }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(notesTitle, 14, currentY);
      currentY += notesTitleHeight;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(notesLines, 14, currentY);
    }

    doc.save(`document_checklist_${userName.replace(/\s+/g, '_')}.pdf`);
  };


  return (
    <div className="space-y-12">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Smart Study Tools"
          subtitle="Get tailored advice and checklists for your study abroad journey. Powered by our advanced database and smart logic."
        />
      </div>

      <div ref={tabsRef} className={cn("transition-all duration-700 ease-out", isTabsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs defaultValue="english-advisor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-8">
            <TabsTrigger value="english-advisor" className="py-2.5">
              <BookOpenText className="mr-2 h-5 w-5" /> English Test Advisor
            </TabsTrigger>
            <TabsTrigger value="document-checklist" className="py-2.5">
              <ListChecks className="mr-2 h-5 w-5" /> Document Checklist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="english-advisor">
            <div className={cn(
                "w-full",
                showEnglishTestResultsArea ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "flex flex-col items-center"
            )}>
              <Card className={cn(
                  "shadow-xl bg-card w-full",
                  showEnglishTestResultsArea ? "md:col-span-1" : "max-w-2xl"
              )}>
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><BookOpenText className="mr-2 h-6 w-6" />Find Your Ideal English Test</CardTitle>
                  <CardDescription>Fill in your details for a tailored recommendation (IELTS, PTE, TOEFL, Duolingo, etc.). This feature uses rule-based logic for cost efficiency.</CardDescription>
                </CardHeader>
                <Form {...englishTestForm}>
                  <form onSubmit={englishTestForm.handleSubmit(onEnglishTestSubmit)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={englishTestForm.control}
                        name="currentLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current English Proficiency Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={englishTestForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeline for Taking the Test</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your timeline" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="1 month">Within 1 month</SelectItem>
                                <SelectItem value="3 months">Within 3 months</SelectItem>
                                <SelectItem value="6 months">Within 6 months</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={englishTestForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget for the Test (NPR)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your budget (Rs.)" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="< NPR 15000">Less than Rs. 15,000</SelectItem>
                                <SelectItem value="NPR 15000 - NPR 30000">Rs. 15,000 - Rs. 30,000</SelectItem>
                                <SelectItem value="NPR 30000 - NPR 45000">Rs. 30,000 - Rs. 45,000</SelectItem>
                                <SelectItem value="> NPR 45000">More than Rs. 45,000</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={englishTestForm.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purpose of the Test</FormLabel>
                            <FormControl><Textarea placeholder="e.g., University application for USA, Immigration to Australia" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isEnglishTestLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isEnglishTestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Get Recommendation
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              {showEnglishTestResultsArea && (
                <div className={cn(
                    "w-full md:col-span-1 space-y-6",
                    "transition-all duration-700 ease-out",
                    englishTestResultsAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}>
                  {isEnglishTestLoading && (
                    <Card className="shadow-xl bg-card">
                      <CardContent className="p-10 text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Generating your recommendation...</p>
                      </CardContent>
                    </Card>
                  )}
                  {englishTestError && !isEnglishTestLoading && (
                    <Alert variant="destructive">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{englishTestError}</AlertDescription>
                    </Alert>
                  )}
                  {englishTestResult && !isEnglishTestLoading && (
                    <div className="space-y-6">
                      <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-background">
                        <CardHeader>
                          <CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-6 w-6" /> Your Personalized Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg text-primary">Recommended Test:</h3>
                            <p className="text-foreground/90 text-xl font-medium">{englishTestResult.testRecommendation}</p>
                          </div>
                          {englishTestResult.badges && englishTestResult.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {englishTestResult.badges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
                                  <CheckCircleIcon className="mr-1.5 h-4 w-4 text-green-500" />
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg text-primary">Reasoning:</h3>
                            <p className="text-foreground/90 whitespace-pre-line">{englishTestResult.reasoning}</p>
                          </div>
                          <div className="pt-4 text-center">
                              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                                  <Link href="/contact">
                                      <MessageSquare className="mr-2 h-5 w-5" /> Want help preparing or booking your test? Talk to our experts!
                                  </Link>
                              </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-xl bg-card">
                        <CardHeader>
                            <CardTitle className="font-headline text-primary flex items-center"><HelpCircle className="mr-2 h-6 w-6" /> Compare Test Types</CardTitle>
                            <CardDescription>General comparison of popular English proficiency tests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Test Name</TableHead>
                                            <TableHead>Typical Cost</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Acceptance</TableHead>
                                            <TableHead>Format</TableHead>
                                            <TableHead>Result Time</TableHead>
                                            <TableHead>Key Features</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testComparisonData.map((test) => (
                                            <TableRow key={test.name}>
                                                <TableCell className="font-medium">{test.name}</TableCell>
                                                <TableCell>{test.cost}</TableCell>
                                                <TableCell>{test.typicalDuration}</TableCell>
                                                <TableCell>{test.acceptance}</TableCell>
                                                <TableCell>{test.format}</TableCell>
                                                <TableCell>{test.resultTime}</TableCell>
                                                <TableCell className="text-xs">{test.keyFeatures.join(', ')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="document-checklist">
            <div className={cn(
                "w-full",
                showDocChecklistResultsArea ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start" : "flex flex-col items-center"
            )}>
              <Card className={cn(
                  "shadow-xl bg-card w-full",
                  showDocChecklistResultsArea ? "md:col-span-1" : "max-w-2xl"
              )}>
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center"><ListChecks className="mr-2 h-6 w-6" />Generate Your Document Checklist</CardTitle>
                  <CardDescription>Provide your details to receive a tailored document list. This feature uses predefined checklists for efficiency.</CardDescription>
                </CardHeader>
                <Form {...docChecklistForm}>
                  <form onSubmit={docChecklistForm.handleSubmit(onDocChecklistSubmit)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={docChecklistForm.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-accent"/>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={docChecklistForm.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Current/Recent Education Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select your education level" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {allEducationLevels.map(level => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={docChecklistForm.control}
                        name="desiredCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desired Country for Study</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {selectableCountries.map(country => (
                                  <SelectItem key={country.value} value={country.value}>{country.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isDocChecklistLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isDocChecklistLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Checklist
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              {showDocChecklistResultsArea && (
                <div className={cn(
                    "w-full md:col-span-1 space-y-6",
                    "transition-all duration-700 ease-out",
                    docChecklistResultsAnimatedIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                )}>
                  <Alert className="bg-secondary/50 border-secondary">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle className="font-semibold text-primary">Important Disclaimer</AlertTitle>
                    <AlertDescription className="text-foreground/80">
                      The checklist provided here includes commonly required documents based on general criteria. Additional documents may be necessary based on your specific academic profile, chosen institution, and personal circumstances. For a comprehensive and personalized document list, we highly recommend visiting our office or contacting us directly.
                    </AlertDescription>
                  </Alert>

                  {isDocChecklistLoading && (
                    <Card className="shadow-xl bg-card">
                      <CardContent className="p-10 text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Generating your checklist...</p>
                      </CardContent>
                    </Card>
                  )}
                  {docChecklistError && !isDocChecklistLoading && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{docChecklistError}</AlertDescription>
                    </Alert>
                  )}
                  {docChecklistResult && !isDocChecklistLoading && (
                    <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-background">
                      <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="font-headline text-accent flex items-center"><FileText className="mr-2 h-6 w-6" /> Document Checklist for {docChecklistForm.getValues('userName')}</CardTitle>
                          <CardDescription>For {docChecklistForm.getValues('educationLevel')} to {docChecklistForm.getValues('desiredCountry')}</CardDescription>
                        </div>
                        <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="ml-auto">
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>PDF Generation Note</AlertTitle>
                          <AlertDescription>
                            Nepali names for documents are shown below for web view but will be excluded from the PDF. Ensure your logo is at `public/logo.png` for the PDF watermark.
                          </AlertDescription>
                        </Alert>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[30%]">English Name</TableHead>
                                <TableHead className="w-[30%]">Nepali Name (नेपाली नाम)</TableHead>
                                <TableHead>Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {docChecklistResult.checklist && docChecklistResult.checklist.length > 0 ? (
                                docChecklistResult.checklist.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{item.englishName}</TableCell>
                                    <TableCell>{item.nepaliName}</TableCell>
                                    <TableCell className="text-sm text-foreground/80">{item.description}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center text-muted-foreground">No specific documents found for your criteria. Please contact us for personalized advice.</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        {docChecklistResult.notes && (
                          <div className="mt-6 p-4 border-t border-border">
                            <h4 className="font-semibold text-lg text-primary mb-2">Important Notes & Advice:</h4>
                            <p className="text-foreground/90 whitespace-pre-line text-sm">{docChecklistResult.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

