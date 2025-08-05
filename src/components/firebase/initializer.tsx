'use client';

import { useEffect } from 'react';
import { getPerformance } from 'firebase/performance';
import { app } from '@/lib/firebase'; // Import the initialized app

export default function FirebaseInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // It's safe to initialize client-side services like performance here,
      // as this component only runs on the client.
      getPerformance(app);
    }
  }, []);

  return null; // This component doesn't render anything
}
