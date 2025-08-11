import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import FirebaseInitializer from '@/components/firebase/initializer';

// Font setup using next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Pixar Educational Consultancy',
  description: 'Your trusted partner in achieving global education dreams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceCodePro.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="RSS Feed for Pixar Educational Consultancy Blog" href="/feed.xml" />
      </head>
      <body className="font-body antialiased">
        <FirebaseInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
