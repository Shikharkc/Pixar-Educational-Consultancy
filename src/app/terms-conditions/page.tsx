
'use client';

import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="space-y-12">
      <SectionTitle
        title="Terms & Conditions"
        subtitle="Guidelines for using our website and services."
      />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Understanding Our Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            Our Terms & Conditions are currently being finalized to clearly define the rules and guidelines for accessing and using the Pixar Educational Consultancy website and its services.
          </p>
          <p>
            This document will cover important aspects such as:
          </p>
          <ul className="list-disc list-inside pl-5 space-y-1">
            <li>Acceptance of terms by using our site/services.</li>
            <li>User responsibilities and conduct.</li>
            <li>Intellectual property rights.</li>
            <li>Disclaimers and limitations of liability.</li>
            <li>Governing law and dispute resolution.</li>
            <li>Modifications to the terms.</li>
          </ul>
          <p>
            We aim to provide a fair and transparent framework for our interactions. Please check back soon for the complete Terms & Conditions.
          </p>
          <p>
            If you have any questions regarding our terms before they are published, please feel free to contact us.
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
