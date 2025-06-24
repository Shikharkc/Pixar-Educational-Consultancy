'use client';

import { useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: "AIzaSyB9OGa_I5vg1vsjPLQQMiUC6xU2TFmrfm0",
  authDomain: "pixar-educational-consultancy.firebaseapp.com",
  projectId: "pixar-educational-consultancy",
  storageBucket: "pixar-educational-consultancy.firebasestorage.app",
  messagingSenderId: "286970299360",
  appId: "1:286970299360:web:3d0f098ee47b6dd282a185",
  measurementId: "G-8W0E04NQFZ"
};

export default function FirebaseInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const apps = getApps();
      if (apps.length === 0) {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        // Initialize Performance Monitoring only on client
        getPerformance(app);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
