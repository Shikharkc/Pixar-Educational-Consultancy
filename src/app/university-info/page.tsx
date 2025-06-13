
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionTitle from '@/components/ui/section-title';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, InfoIcon as AlertInfoIcon, MapPin, BookOpen, University as UniversityIconLucide, ExternalLink, Briefcase, DollarSign, ClipboardCheck, CalendarDays, ArrowLeft } from 'lucide-react';
import { pathwayPlanner, type PathwayPlannerInput, type PathwayPlannerOutput } from '@/ai/flows/pathway-planner';
import { cn } from '@/lib/utils';
import { UniversityIcon } from '@/lib/data'; // Assuming this is the one from data for general use if needed

type UniversitySuggestion = Exclude<PathwayPlannerOutput['universitySuggestions'], undefined>[number];

function UniversityInfoContent() {
  const searchParams = useSearchParams();
  const [university, setUniversity] = useState<UniversitySuggestion | null>(null);
  const [initialQuery, setInitialQuery] = useState<PathwayPlannerInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const country = searchParams.get('country');
    const fieldOfStudy = searchParams.get('field');
    const gpa = searchParams.get('gpa');
    const targetEducationLevel = searchParams.get('level');
    const indexString = searchParams.get('index');

    if (country && fieldOfStudy && gpa && targetEducationLevel && indexString) {
      const query: PathwayPlannerInput = { country, fieldOfStudy, gpa, targetEducationLevel };
      setInitialQuery(query);
      const uniIndex = parseInt(indexString, 10);

      const fetchUniversity = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await pathwayPlanner(query);
          if (result.universitySuggestions && result.universitySuggestions[uniIndex]) {
            setUniversity(result.universitySuggestions[uniIndex]);
          } else {
            setError('University data not found or index out of bounds.');
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load university details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchUniversity();
    } else {
      setError('Required information to display university details is missing.');
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-lg">Loading university details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-10">
        <AlertInfoIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <div className="mt-4">
            <Button asChild variant="outline">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to Home</Link>
            </Button>
        </div>
      </Alert>
    );
  }

  if (!university) {
    return (
      <Alert className="max-w-2xl mx-auto my-10">
        <AlertInfoIcon className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>Could not find the university details. Please try again or go back to the homepage.</AlertDescription>
         <div className="mt-4">
            <Button asChild variant="outline">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to Home</Link>
            </Button>
        </div>
      </Alert>
    );
  }
  
  const placeholderLogo = `https://placehold.co/300x200.png?text=${encodeURIComponent(university.name.substring(0, Math.min(university.name.length,10)))}`;

  return (
    <div className="space-y-10">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/#pathway-search-section"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Search Results</Link>
            </Button>
        </div>

      <SectionTitle title={university.name} subtitle={university.category} />

      <Card className="shadow-xl overflow-hidden bg-card">
        <div className="relative w-full h-64 md:h-96">
          <Image 
            src={placeholderLogo} // Replace with actual image if available
            alt={`${university.name} campus or logo`} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={university.logoDataAiHint || 'university campus building'}
          />
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Location:</strong> {university.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Type:</strong> {university.type}</span>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Typical Duration:</strong> {university.programDuration}</span>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-foreground/90"><strong>Tuition:</strong> {university.tuitionCategory} {university.tuitionFeeRange && `(${university.tuitionFeeRange})`}</span>
            </div>
            {university.nextIntakeDate && (
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-foreground/90"><strong>Next Intake:</strong> {university.nextIntakeDate}</span>
              </div>
            )}
            {university.englishTestRequirements && (
              <div className="flex items-center space-x-3 md:col-span-2">
                <ClipboardCheck className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-foreground/90"><strong>English Tests:</strong> {university.englishTestRequirements}</span>
              </div>
            )}
          </div>

          {university.website && (
            <div className="text-center mt-6">
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground">
                <a href={university.website} target="_blank" rel="noopener noreferrer">
                  Visit University Website <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="text-center py-10">
        <SectionTitle title="Interested in this University?" subtitle="Let us help you with your application."/>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/book-appointment?collegeName=${encodeURIComponent(university.name)}&country=${encodeURIComponent(initialQuery?.country || '')}&field=${encodeURIComponent(initialQuery?.fieldOfStudy || '')}&gpa=${encodeURIComponent(initialQuery?.gpa || '')}&level=${encodeURIComponent(initialQuery?.targetEducationLevel || '')}`}>
            Book a Consultation
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default function UniversityInfoPage() {
  return (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
    }>
      <UniversityInfoContent />
    </Suspense>
  );
}
