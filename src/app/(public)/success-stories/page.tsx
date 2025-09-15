
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { visaSuccesses } from '@/lib/data.tsx';
import { CheckCircle, Trophy } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [gridRef, isGridVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  // Combine all students into a single array
  const allSuccesses = useMemo(() => {
    return Object.values(visaSuccesses).flat();
  }, []);

  return (
    <div className="space-y-12 md:space-y-16">
      <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle 
          title="Our Student Success Stories" 
          subtitle="We take pride in the achievements of our students. Here are some of the many who have successfully obtained their visas with our guidance."
        />
      </section>

      <section ref={gridRef} className={cn("transition-all duration-700 ease-out", isGridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <Card className="shadow-lg bg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allSuccesses.map((student, index) => {
                const [itemRef, isItemVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
                return (
                  <div
                    key={index}
                    ref={itemRef}
                    className={cn(
                        "transition-all duration-500 ease-out",
                        isItemVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}
                    style={{transitionDelay: `${Math.min(index * 20, 1000)}ms`}}
                  >
                    <div
                      className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-lg h-full border border-transparent hover:border-primary/20 hover:shadow-md"
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.destination}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {allSuccesses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Success stories will be updated soon!
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
