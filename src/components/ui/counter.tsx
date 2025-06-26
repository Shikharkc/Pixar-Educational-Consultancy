
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CounterProps {
  target: number;
  duration?: number;
  isInView: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Counter({
  target,
  duration = 2,
  isInView,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (isInView && countRef.current) {
      const counter = { value: 0 };
      
      // Kill previous animation if it exists to prevent re-triggering issues
      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(counter, {
        value: target,
        duration: duration,
        ease: 'power1.out',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = prefix + Math.floor(counter.value).toLocaleString() + suffix;
          }
        },
      });
    }
  }, [isInView, target, duration, prefix, suffix]);

  return <span ref={countRef} className={className}>0</span>;
}
