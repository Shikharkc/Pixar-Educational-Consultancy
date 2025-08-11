
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { socialPlatforms } from '@/lib/data.tsx';

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={sidebarRef} className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
      <Button
        variant="secondary"
        size="icon"
        className="rounded-r-none rounded-l-lg h-12 w-12 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle social media links"
      >
        <Share2 className="h-6 w-6 text-primary" />
      </Button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
        )}
      >
        {isOpen && (
          <Card className="ml-2 shadow-lg w-64">
            <CardContent className="p-4">
              <h4 className="font-semibold text-center mb-3 text-primary">Follow Us</h4>
              <ul className="space-y-2">
                {socialPlatforms.map((platform) => (
                  <li key={platform.name}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center space-x-3 p-2 rounded-md hover:bg-accent/10 transition-colors",
                        platform.colorClass
                      )}
                    >
                      <platform.icon className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground">{platform.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
