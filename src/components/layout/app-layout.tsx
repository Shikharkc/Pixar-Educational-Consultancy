import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import { Info } from 'lucide-react'; // Import the Info icon
import FirebaseInitializer from '../firebase/initializer';
import SocialSidebar from './SocialSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // You can change or remove this message easily
  const siteStatusMessage = "Welcome to Pixar Educational Consultancy! Our core features like College Search and Student Hub Tools are ready for you to explore. Some informational content is still being polished. We appreciate your understanding as we put the final touches on our site!";
  
  // Set this to false or remove the block to hide the message
  const showSiteStatusMessage = true; 

  return (
    <div className="flex flex-col min-h-screen">
      <FirebaseInitializer />
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
      <Footer />
    </div>
  );
}
