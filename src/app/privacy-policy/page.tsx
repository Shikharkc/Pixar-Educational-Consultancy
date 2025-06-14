
'use client';

import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-12">
      <SectionTitle
        title="Privacy Policy"
        subtitle="How we handle your information."
      />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="mr-2 h-6 w-6 text-primary" />
            Our Commitment to Your Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            Our full Privacy Policy is currently being updated to provide you with comprehensive details on how we collect, use, share, and protect your personal information. We are committed to safeguarding your privacy and ensuring transparency.
          </p>
          <p>
            This policy will outline:
          </p>
          <ul className="list-disc list-inside pl-5 space-y-1">
            <li>The types of information we collect.</li>
            <li>How and why we use your information.</li>
            <li>When and with whom we might share your information.</li>
            <li>Your rights regarding your personal data.</li>
            <li>Our security measures to protect your information.</li>
          </ul>
          <p>
            Please check back soon for the complete policy.
          </p>
          <p>
            If you have any immediate questions or concerns about your privacy, please do not hesitate to contact us.
          </p>
          <div className="pt-4 text-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
