'use client';

import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsConditionsPage() {
  const lastUpdated = "June 20, 2024";

  return (
    <div className="space-y-12">
      <SectionTitle
        title="Terms and Conditions"
        subtitle={`Last Updated: ${lastUpdated}`}
      />
      <Card className="max-w-4xl mx-auto shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-3 h-7 w-7 text-primary" />
            Guidelines for Using Our Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/80 prose prose-sm md:prose-base dark:prose-invert prose-headings:text-primary prose-a:text-accent max-w-none">
          
          <section>
            <h3>1. Introduction and Acceptance of Terms</h3>
            <p>
              Welcome to Pixar Educational Consultancy ("Pixar Edu," "we," "our," "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, www.pixaredu.com (the "Site"), including any content, functionality, and services offered on or through the Site, such as our Pathway Planner, Document Checklist, and other informational resources.
            </p>
            <p>
              By accessing or using our Site, you agree to be bound by these Terms and our <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree to these Terms, you must not access or use the Site.
            </p>
          </section>

          <section>
            <h3>2. Description of Services</h3>
            <p>
              Our Site provides information about studying abroad, our consultancy services, and interactive tools designed to assist you in your educational journey. These services include, but are not limited to:
            </p>
            <ul>
              <li>Educational counseling and guidance.</li>
              <li>Information on universities, courses, and countries.</li>
              <li>AI-powered tools like the Pathway Planner to provide university suggestions based on user input.</li>
              <li>Checklists and guides to assist with application preparation.</li>
            </ul>
            <p>
              The information and suggestions provided by our tools are for guidance purposes only and do not constitute a guarantee of admission to any institution.
            </p>
          </section>

          <section>
            <h3>3. User Responsibilities and Conduct</h3>
            <p>
              As a user of our Site, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information when requested by our forms or tools.</li>
              <li>Use the Site and its services for lawful purposes only.</li>
              <li>Not misuse the services, including our AI-powered tools. Automated querying, scraping, or excessive use beyond reasonable personal inquiry is strictly prohibited. We reserve the right to limit or block access for users who violate these terms.</li>
              <li>Respect the intellectual property rights of Pixar Edu as outlined in Section 4.</li>
            </ul>
          </section>

          <section>
            <h3>4. Intellectual Property Rights</h3>
            <p>
              The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Pixar Educational Consultancy, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site without our prior written consent.
            </p>
          </section>

          <section>
            <h3>5. Disclaimers</h3>
            <p>
              The information provided on our Site is for general informational purposes only. We make no warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of the information.
            </p>
            <p>
              <strong>Disclaimer for AI-Generated Content:</strong> The suggestions provided by our Pathway Planner and other AI tools are generated based on the data you provide and the model's training. While we strive to provide helpful and relevant information, we do not guarantee the accuracy, relevance, or completeness of these suggestions. University requirements, course details, and visa regulations change frequently. You must independently verify all information with official university and government sources.
            </p>
            <p>
              Your use of the Site and reliance on any information is solely at your own risk.
            </p>
          </section>

          <section>
            <h3>6. Limitation of Liability</h3>
            <p>
              In no event will Pixar Educational Consultancy, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Site, any websites linked to it, any content on the Site, or services obtained through the Site, including any direct, indirect, special, incidental, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h3>7. Third-Party Links</h3>
            <p>
              Our Site may contain links to third-party websites or services that are not owned or controlled by Pixar Edu (e.g., university websites, government immigration sites). We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>
          </section>

          <section>
            <h3>8. Changes to the Terms</h3>
            <p>
              We reserve the right to revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the Site following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>
          
          <section>
            <h3>9. Governing Law and Jurisdiction</h3>
            <p>
              All matters relating to the Site and these Terms, and any dispute or claim arising therefrom or related thereto, shall be governed by and construed in accordance with the laws of Nepal without giving effect to any choice or conflict of law provision or rule.
            </p>
          </section>

          <section>
            <h3>10. Contact Information</h3>
            <p>
              If you have any questions about these Terms and Conditions, please contact us through our <Link href="/contact">contact page</Link> or by emailing us at <a href="mailto:info@pixaredu.com">info@pixaredu.com</a>.
            </p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
