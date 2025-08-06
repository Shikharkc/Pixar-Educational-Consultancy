
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { FileText, Shield, DollarSign, Briefcase, Heart, Home, Plane, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChecklistItem {
  text: string;
  subItems?: string[];
  link?: { href: string; text: string };
}

interface ToolkitSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  checklist: ChecklistItem[];
}

const toolkitData: ToolkitSection[] = [
  {
    id: 'documents',
    title: 'Essential Documents',
    icon: FileText,
    description: 'Keep these documents safe and accessible in your carry-on luggage. Have both physical and digital copies.',
    checklist: [
      { text: 'Passport & Visa', subItems: ['Original passport with valid visa.', 'Photocopies of passport info page and visa.'] },
      { text: 'University Admission Documents', subItems: ['Original Offer Letter.', 'CoE (Australia), I-20 (USA), or CAS Statement (UK).', 'Tuition fee payment receipts.', 'Scholarship letter (if any).'], link: { href: '/blog/how-to-read-and-understand-a-coe-or-offer-letter', text: 'Understand your offer letter' } },
      { text: 'Academic Credentials', subItems: ['Original mark sheets and certificates (SEE, +2, Bachelor\'s).', 'Official English test score report (IELTS/PTE/TOEFL).'] },
      { text: 'Financial Proof', subItems: ['Copies of financial documents submitted for the visa.', 'Proof of GIC for Canada (if applicable).'] },
      { text: 'Travel & Accommodation', subItems: ['Flight tickets.', 'Accommodation booking confirmation.', 'Airport pickup details (if arranged).'] },
    ],
  },
  {
    id: 'finances',
    title: 'Financial Preparations',
    icon: DollarSign,
    description: 'Managing your money effectively from day one is crucial for a stress-free experience.',
    checklist: [
      { text: 'Currency Exchange', subItems: ['Exchange a reasonable amount of cash into the local currency for immediate needs.'] },
      { text: 'International Cards', subItems: ['Inform your Nepali bank about your travel plans.', 'Ensure your debit/credit card is enabled for international use.'] },
      { text: 'Open a Local Bank Account', subItems: ['Research student bank account options in your destination country.', 'Plan to open one within the first week of arrival.'] },
      { text: 'Budgeting', subItems: ['Create a detailed budget for your monthly expenses.'], link: { href: '/blog/student-budget-calculator-–-free-tool-for-planning', text: 'See our budgeting guide' } },
    ],
  },
  {
    id: 'packing',
    title: 'Smart Packing Guide',
    icon: Briefcase,
    description: 'Pack smart, not heavy. Prioritize essentials and remember you can buy most things in your destination country.',
    checklist: [
      { text: 'Carry-On Luggage', subItems: ['All essential documents.', 'Laptop, phone, and other valuables.', 'Prescription medications with a doctor\'s note.', 'A change of clothes.', 'Universal travel adapter.'] },
      { text: 'Checked Luggage', subItems: ['Clothing suitable for the climate.', 'Comfortable shoes.', 'Some favorite spices or small kitchen items (check customs rules!).', 'Sentimental items from home.'] },
      { text: 'What NOT to Pack', subItems: ['Excessive clothing, books, or stationery.', 'Items restricted by customs regulations.'] },
    ],
  },
  {
    id: 'health',
    title: 'Health & Insurance',
    icon: Heart,
    description: 'Your health and well-being are top priorities. Ensure you are well-prepared for any medical needs.',
    checklist: [
      { text: 'Health Insurance', subItems: ['Confirm your Overseas Student Health Cover (OSHC for Australia) or other required insurance is active.', 'Keep a digital and physical copy of your policy.'], link: { href: '/blog/what-is-oshc-why-overseas-health-cover-matters', text: 'What is OSHC?' } },
      { text: 'Medical Check-up', subItems: ['Complete a full health and dental check-up before you leave Nepal.'] },
      { text: 'Medications', subItems: ['Carry a sufficient supply of any prescription medication, along with the prescription itself.'] },
      { text: 'Vaccinations', subItems: ['Ensure all your vaccinations are up-to-date and carry the records.'] },
    ],
  },
  {
    id: 'arrival',
    title: 'Arrival & First Few Days',
    icon: Plane,
    description: 'A smooth arrival sets a positive tone for your entire journey. Know what to expect and what to do.',
    checklist: [
      { text: 'Immigration & Customs', subItems: ['Have your passport, visa, and university offer letter ready for the immigration officer.'] },
      { text: 'Transport from Airport', subItems: ['Pre-plan your transport to your accommodation (airport pickup, taxi, public transport).'] },
      { text: 'Get a Local SIM Card', subItems: ['Purchase a local SIM card at the airport or a nearby store for connectivity.'] },
      { text: 'University Orientation', subItems: ['Attend all orientation sessions. They are crucial for understanding university rules, services, and meeting new people.'] },
      { text: 'Explore Your Neighborhood', subItems: ['Take a walk to find local grocery stores, banks, and transport links.'] },
    ],
  },
];

export default function PreDepartureToolkitPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Pre-Departure Toolkit"
          subtitle="Your comprehensive checklist for a smooth and successful transition to studying abroad. Be prepared, confident, and ready for your adventure!"
        />
      </section>

      <section className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {toolkitData.map((section, index) => {
            const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={section.id} ref={itemRef} className={cn("transition-all duration-500 ease-out", isItemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
                  <AccordionItem value={section.id} className="border-b-0">
                    <AccordionTrigger className="text-xl font-headline text-primary hover:text-accent hover:no-underline px-6 py-4">
                      <div className="flex items-center">
                        <section.icon className="h-7 w-7 mr-3 text-accent" />
                        {section.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                      <ul className="space-y-3">
                        {section.checklist.map((item, itemIndex) => (
                          <li key={itemIndex} className="p-3 bg-secondary/30 rounded-md">
                            <p className="font-semibold text-foreground/90">{item.text}</p>
                            {item.subItems && (
                              <ul className="list-disc list-inside pl-4 mt-1 text-sm text-foreground/80 space-y-1">
                                {item.subItems.map((sub, subIndex) => (
                                  <li key={subIndex}>{sub}</li>
                                ))}
                              </ul>
                            )}
                            {item.link && (
                              <Button variant="link" asChild className="p-0 h-auto mt-2 text-accent">
                                <Link href={item.link.href}>
                                  {item.link.text}
                                </Link>
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </div>
            );
          })}
        </Accordion>
      </section>

       <section className="text-center">
        <h3 className="text-xl md:text-2xl font-headline font-semibold text-primary mb-4">Feeling Overwhelmed? We're Here to Help.</h3>
        <p className="text-foreground/80 mb-6 max-w-xl mx-auto">
          PixarEdu provides comprehensive pre-departure briefings to all our students to ensure you are fully prepared.
        </p>
        <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/contact">
                Contact an Advisor
            </Link>
        </Button>
      </section>
    </div>
  );
}
