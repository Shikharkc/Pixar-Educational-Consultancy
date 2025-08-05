import type { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Info } from 'lucide-react'; 
import SocialSidebar from '@/components/layout/SocialSidebar';
import Chatbot from '@/components/chatbot/Chatbot';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const siteStatusMessage = "Discover your ideal university instantly with our new AI Pathway Planner on the homepage! Explore all our guides and tools under the 'Resources' menu.";
  
  const showSiteStatusMessage = true; 

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showSiteStatusMessage && (
        <div className="bg-primary/10 text-primary border-b border-primary/20 p-3 text-center text-sm shadow-sm">
          <div className="container mx-auto flex items-center justify-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{siteStatusMessage}</p>
          </div>
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <SocialSidebar />
      <Chatbot />
      <Footer />
    </div>
  );
}
