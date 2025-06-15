
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircleQuestion, HelpCircle, Lightbulb, ShieldCheck, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface QnAItem {
  question: string;
  answer: string;
  tips?: string[];
}

interface CountryQnA {
  countryName: string;
  countrySlug: string;
  intro: string;
  commonQuestions: QnAItem[];
  countrySpecificTips: string[];
}

const interviewData: CountryQnA[] = [
  {
    countryName: 'USA',
    countrySlug: 'usa',
    intro: 'US visa interviews (typically for F-1 visa) focus heavily on your intent to return to your home country after studies, your financial capacity, and your specific study plans. Be prepared to answer questions confidently and honestly.',
    commonQuestions: [
      { question: "Why do you want to study in the USA?", answer: "Focus on specific academic reasons, research opportunities, quality of education, and how it aligns with your career goals. Avoid generic answers." },
      { question: "Why did you choose this specific university?", answer: "Mention specific programs, faculty, research facilities, or unique aspects of the university that attracted you. Show you've done your research." },
      { question: "How will you finance your education?", answer: "Clearly explain your funding sources (e.g., family savings, education loan, scholarships). Be prepared to show supporting documents if asked." },
      { question: "What are your plans after graduation?", answer: "Emphasize your intent to return to your home country and how your US education will help you in your career there. Avoid expressing strong interest in staying in the US permanently." },
      { question: "Who is sponsoring your education?", answer: "State the sponsor's name, relationship to you, and their occupation/source of income." },
      { question: "Do you have relatives in the USA?", answer: "Answer honestly. If yes, be prepared to provide their details and visa status if asked." },
    ],
    countrySpecificTips: [
      "Dress formally and be punctual.",
      "Maintain eye contact and answer confidently.",
      "Be prepared for a short interview; make your answers concise and to the point.",
      "Understand the SEVIS fee and Form I-20.",
      "Clearly articulate your ties to your home country (family, job prospects, assets)."
    ],
  },
  {
    countryName: 'Australia',
    countrySlug: 'australia',
    intro: 'Australian student visa interviews often assess the Genuine Temporary Entrant (GTE) requirement. You need to convince the officer that you intend to study temporarily and return home.',
    commonQuestions: [
      { question: "Why Australia for your studies?", answer: "Highlight Australia's education quality, specific course strengths, multicultural environment, or research opportunities relevant to your field." },
      { question: "What is your understanding of the GTE requirement?", answer: "Explain that it means you genuinely intend to stay in Australia temporarily for study and will return home after." },
      { question: "Tell me about your chosen course and university.", answer: "Detail why this course and institution are the best fit for your academic and career goals. Relate it to your previous studies or work experience." },
      { question: "How do your studies in Australia relate to your future career plans in your home country?", answer: "Provide a clear link between your chosen course and career prospects back home." },
      { question: "How will you manage your living expenses in Australia?", answer: "Explain your budget and financial plan, including accommodation, food, transport, and OSHC (Overseas Student Health Cover)." },
    ],
    countrySpecificTips: [
      "Be familiar with your GTE statement.",
      "Understand the conditions of your student visa (e.g., work rights).",
      "Research living costs in your chosen city.",
      "Be prepared to discuss your knowledge of Australia and your chosen institution."
    ],
  },
  {
    countryName: 'UK',
    countrySlug: 'uk',
    intro: 'UK student visa interviews (credibility interviews) aim to assess your genuineness as a student and your ability to follow the course. Ensure you understand your CAS statement.',
    commonQuestions: [
      { question: "Why did you choose the UK over other countries?", answer: "Mention the UK's academic reputation, specific course structure, shorter course durations (for some programs), or cultural appeal." },
      { question: "Why this particular university and course in the UK?", answer: "Be specific about modules, research, faculty, and how they align with your goals. Show you haven't just applied randomly." },
      { question: "Can you explain the modules you will be studying?", answer: "Show familiarity with your course content. This demonstrates genuine interest." },
      { question: "How will you fund your studies and living expenses?", answer: "Be clear about your financial sources and have documents ready if required. Understand the required maintenance funds." },
      { question: "What are your accommodation plans in the UK?", answer: "Explain if you've applied for university housing or how you plan to find private accommodation." },
    ],
    countrySpecificTips: [
      "Thoroughly understand your Confirmation of Acceptance for Studies (CAS).",
      "Be prepared for questions about your previous education and any study gaps.",
      "Research the city/town where your university is located.",
      "Articulate how your chosen course will benefit your future career."
    ],
  },
  {
    countryName: 'Canada',
    countrySlug: 'canada',
    intro: 'Canadian visa interviews are not always mandatory for study permits but can be requested. Focus on your study plan, financial ability, and ties to your home country.',
    commonQuestions: [
      { question: "Why do you wish to study in Canada?", answer: "Discuss Canada's education system, quality of life, specific program strengths, or multicultural society." },
      { question: "Why this program and Designated Learning Institution (DLI)?", answer: "Explain your research into the program and DLI, and how it fits your academic and career objectives." },
      { question: "How will this program enhance your career prospects?", answer: "Link the skills and knowledge from the program to job opportunities in your home country or globally (while still emphasizing return)." },
      { question: "Who will be supporting you financially?", answer: "Clearly state your financial sponsor(s) and their capacity to support you. Be ready to discuss proof of funds (e.g., GIC if applicable)." },
      { question: "Do you intend to return to your home country after your studies?", answer: "Affirm your intent to return, mentioning ties like family, property, or career opportunities." },
    ],
    countrySpecificTips: [
      "Understand the Student Direct Stream (SDS) if applicable to you.",
      "Be clear about your study plan and how it progresses logically from your previous education.",
      "If you have study gaps, be prepared to explain them.",
      "Knowledge about the province and city where you plan to study can be beneficial."
    ],
  },
  {
    countryName: 'New Zealand',
    countrySlug: 'new-zealand',
    intro: 'New Zealand visa interviews emphasize your genuine student status, financial stability, and intention to adhere to visa conditions. Focus on demonstrating you are a bona fide student.',
    commonQuestions: [
      { question: "Why have you chosen New Zealand for your education?", answer: "Mention its safe environment, high-quality education, specific research areas, or lifestyle appeal relevant to your studies." },
      { question: "What are your reasons for selecting this particular course and institution?", answer: "Detail your research into the course curriculum, teaching staff, and how it aligns with your career goals." },
      { question: "How do you plan to cover your tuition fees and living costs?", answer: "Explain your financial arrangements clearly. Be aware of the specific funds required by Immigration New Zealand." },
      { question: "What ties do you have to your home country that would ensure your return?", answer: "Discuss family, property, job offers or strong career prospects in your home country post-graduation." },
      { question: "Are you aware of the work rights for students in New Zealand?", answer: "Show you understand the rules regarding part-time work during studies and full-time work during scheduled breaks." },
    ],
    countrySpecificTips: [
      "Be prepared to discuss your Offer of Place and how you meet the course entry requirements.",
      "Emphasize your English language proficiency.",
      "Understand the cost of living and have a realistic budget.",
      "Be clear about your post-study intentions, focusing on returning home or gaining initial experience before returning."
    ],
  },
];

const generalInterviewTips = [
  "Research Thoroughly: Know about the country, city, university, and your course in detail.",
  "Be Punctual: Whether online or in-person, be on time or log in early.",
  "Dress Professionally: First impressions matter. Business casual or formal attire is usually appropriate.",
  "Stay Calm and Confident: Speak clearly and maintain good eye contact. It's okay to take a moment to think before answering.",
  "Be Honest and Consistent: Ensure your answers align with your application documents. Don't provide false information.",
  "Listen Carefully: Understand the question before you answer. Ask for clarification if needed.",
  "Keep Answers Concise: Be direct and to the point. Avoid rambling.",
  "Prepare Your Documents: Have all necessary documents organized and easily accessible, even if not explicitly asked for.",
  "Practice Common Questions: Rehearse your answers to common questions, but don't sound robotic.",
  "Show Enthusiasm: Demonstrate genuine interest in your chosen field of study and institution.",
  "Thank the Interviewer: At the end of the interview, thank the visa officer for their time.",
];


export default function InterviewQAPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [tabsContainerRef, isTabsContainerVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Student Visa Interview Q&amp;A"
          subtitle="Prepare for your visa interview with common questions, answers, and tips for popular study destinations."
        />
      </section>

      <div ref={tabsContainerRef} className={cn("transition-all duration-700 ease-out", isTabsContainerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Tabs defaultValue={interviewData[0].countrySlug} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-auto mb-8">
            {interviewData.map((country) => (
              <TabsTrigger key={country.countrySlug} value={country.countrySlug} className="py-2.5">
                {country.countryName}
              </TabsTrigger>
            ))}
          </TabsList>

          {interviewData.map((country) => (
            <TabsContent key={country.countrySlug} value={country.countrySlug} className="space-y-8">
              <Card className="shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center">
                    <MessageCircleQuestion className="mr-2 h-6 w-6" /> Visa Interview Guide: {country.countryName}
                  </CardTitle>
                  <CardDescription>{country.intro}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full space-y-4">
                    <AccordionItem value="common-questions" className="border border-border bg-background/30 shadow-sm rounded-lg hover:shadow-md">
                      <AccordionTrigger className="text-lg font-medium text-primary hover:text-accent px-4 py-3">
                        <HelpCircle className="mr-2 h-5 w-5" /> Common Questions
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-1 pb-3 space-y-3">
                        {country.commonQuestions.map((qna, index) => (
                          <div key={index} className="py-2">
                            <h4 className="font-semibold text-foreground/90">{qna.question}</h4>
                            <p className="text-sm text-foreground/70 mt-1">{qna.answer}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="country-specific-tips" className="border border-border bg-background/30 shadow-sm rounded-lg hover:shadow-md">
                      <AccordionTrigger className="text-lg font-medium text-primary hover:text-accent px-4 py-3">
                        <Lightbulb className="mr-2 h-5 w-5" /> {country.countryName} Specific Tips
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-1 pb-3">
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                          {country.countrySpecificTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card className="mt-12 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-accent flex items-center">
              <ShieldCheck className="mr-2 h-6 w-6" /> General Interview Best Practices
            </CardTitle>
            <CardDescription>These tips apply to most student visa interviews, regardless of the country.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              {generalInterviewTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
            <div className="mt-6 text-center">
                <Button asChild variant="solid" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/contact?service=visa_interview_preparation">
                        Book Mock Interview Session <Users className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
