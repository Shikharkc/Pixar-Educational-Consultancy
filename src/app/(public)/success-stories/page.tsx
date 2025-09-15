
'use client';

import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { visaSuccesses } from '@/lib/data.tsx';
import { CheckCircle, Trophy } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TrophyStyle {
  id: number;
  x: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
}


// New component for the background animation
const AnimatedBackground = () => {
  const [trophies, setTrophies] = useState<TrophyStyle[]>([]);

  useEffect(() => {
    // Generate random values only on the client-side to prevent hydration mismatch
    const generatedTrophies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 10, // Slower duration: 10s to 15s
      delay: Math.random() * 10, // Staggered start times
      scale: Math.random() * 0.4 + 0.3, // Smaller icons: 0.3x to 0.7x
      opacity: Math.random() * 0.2 + 0.05, // More subtle: 5% to 25% opacity
    }));
    setTrophies(generatedTrophies);
  }, []); // Empty dependency array ensures this runs only once on the client

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {trophies.map(trophy => (
        <motion.div
          key={trophy.id}
          className="absolute text-accent"
          style={{
            x: trophy.x,
            scale: trophy.scale,
            opacity: trophy.opacity,
            bottom: '-20%', // Start from below the screen
          }}
          animate={{
            y: ['0%', '-120vh'], // Animate to way above the screen
          }}
          transition={{
            duration: trophy.duration,
            delay: trophy.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <Trophy />
        </motion.div>
      ))}
    </div>
  );
};


export default function SuccessStoriesPage() {
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [gridRef, isGridVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });

  // Combine all students into a single array
  const allSuccesses = useMemo(() => {
    return Object.values(visaSuccesses).flat();
  }, []);

  return (
    <div className="relative overflow-hidden space-y-12 md:space-y-16">
      <AnimatedBackground />
      <div className="relative z-10">
          <section ref={titleRef} className={cn("transition-all duration-700 ease-out", isTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <SectionTitle 
              title="Our Student Success Stories" 
              subtitle="We take pride in the achievements of our students. Here are some of the many who have successfully obtained their visas with our guidance."
            />
          </section>

          <section ref={gridRef} className={cn("transition-all duration-700 ease-out", isGridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
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
    </div>
  );
}
