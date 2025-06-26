'use client';

import Image from 'next/image';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { testimonials } from '@/lib/data';
import type { Testimonial } from '@/lib/data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });

  return (
    <div className="space-y-12">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle
          title="Our Success Stories"
          subtitle="Hear from students who have achieved their global education dreams with our guidance."
        />
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => {
            const [cardRef, isCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
            return (
              <div key={testimonial.id} ref={cardRef} className={cn("transition-all duration-500 ease-out", isCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    {testimonial.avatarUrl && (
                      <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                        data-ai-hint={testimonial.dataAiHint || "student portrait"}
                      />
                    )}
                    <div>
                      <CardTitle className="font-headline text-lg text-primary">{testimonial.name}</CardTitle>
                      <p className="text-xs text-accent">{testimonial.studyDestination}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-foreground/80 italic text-sm">&quot;{testimonial.text}&quot;</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
