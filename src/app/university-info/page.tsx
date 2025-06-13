
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
// Assuming UniversityIcon from '@/lib/data' is not needed here as UniversityIconLucide is more specific.
// If it was a different icon, it would be: import { UniversityIcon } from '@/lib/data';


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
      setInitialQuery(query); // Store the initial query
      const uniIndex = parseInt(indexString, 10);

      const fetchUniversity = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Re-run the pathwayPlanner with the original query to get the list
          const result = await pathwayPlanner(query);
          if (result.universitySuggestions && result.universitySuggestions[uniIndex]) {
            setUniversity(result.universitySuggestions[uniIndex]);
          } else {
            setError('University data not found or index out of bounds. The list might have changed or the index is incorrect.');
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load university details.');
          console.error("Error fetching university details:", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUniversity();
    } else {
      setError('Required information to display university details is missing from the URL. Please go back and try again.');
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
                <Link href="/#pathway-search-section"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to Home Search</Link>
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
        <AlertDescription>Could not find the university details. Please ensure you came from a valid link or try searching again.</AlertDescription>
         <div className="mt-4">
            <Button asChild variant="outline">
                <Link href="/#pathway-search-section"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to Home Search</Link>
            </Button>
        </div>
      </Alert>
    );
  }
  
  const placeholderLogo = `https://placehold.co/600x400.png?text=${encodeURIComponent(university.name.substring(0, Math.min(university.name.length,15)))}`;

  return (
    <div className="space-y-10">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/#pathway-search-section"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Search Results</Link>
            </Button>
        </div>

      <SectionTitle title={university.name} subtitle={university.category || 'University Details'} />

      <Card className="shadow-xl overflow-hidden bg-card">
        <div className="relative w-full h-64 md:h-80 bg-muted">
          <Image 
            src={placeholderLogo} 
            alt={`${university.name} campus or logo placeholder`} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={university.logoDataAiHint || 'university building campus'}
            priority
          />
        </div>
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{university.name}</CardTitle>
            <CardDescription>{university.category}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-base">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground/90">Location:</p>
                <p className="text-foreground/80">{university.location || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground/90">Type:</p>
                <p className="text-foreground/80">{university.type || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground/90">Typical Duration:</p>
                <p className="text-foreground/80">{university.programDuration || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground/90">Tuition:</p>
                <p className="text-foreground/80">
                  {university.tuitionCategory || 'N/A'} 
                  {university.tuitionFeeRange && ` (${university.tuitionFeeRange})`}
                </p>
              </div>
            </div>
            {university.nextIntakeDate && (
              <div className="flex items-start space-x-3">
                <CalendarDays className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                 <div>
                    <p className="font-semibold text-foreground/90">Next Intake(s):</p>
                    <p className="text-foreground/80">{university.nextIntakeDate}</p>
                </div>
              </div>
            )}
            {university.englishTestRequirements && (
              <div className="flex items-start space-x-3 md:col-span-2">
                <ClipboardCheck className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                    <p className="font-semibold text-foreground/90">English Test Requirements:</p>
                    <p className="text-foreground/80">{university.englishTestRequirements}</p>
                </div>
              </div>
            )}
          </div>

          {university.website && (
            <div className="text-center mt-8">
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
    // Wrap with Suspense to handle fallback during client-side navigation
    // and useSearchParams usage.
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

