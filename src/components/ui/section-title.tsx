import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode; // To allow for actions like buttons next to the title
}

export default function SectionTitle({ title, subtitle, className, children }: SectionTitleProps) {
  return (
    <div className={cn("mb-12 md:mb-20 text-center relative", className)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary/0 via-accent to-primary/0 rounded-full opacity-50 mb-4"></div>
      <h2 className="text-3xl md:text-5xl font-headline font-bold text-primary mb-4 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-16 h-1.5 bg-primary/10 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-accent rounded-full animate-[shimmer_2s_infinite]"></div>
      </div>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
