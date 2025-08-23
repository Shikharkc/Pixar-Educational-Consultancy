
import type { ReactNode } from 'react';

// This layout ensures the Welcome page takes up the full screen without
// the standard public header, footer, or other components.
export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
