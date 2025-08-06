
import SectionTitle from '@/components/ui/section-title';

export default function TermsAndConditionsPage() {
  return (
    <div className="space-y-8">
      <SectionTitle title="Terms and Conditions" />
      <div className="prose dark:prose-invert max-w-4xl mx-auto">
        <p><strong>Last Updated: [Date]</strong></p>

        <h3>1. Agreement to Terms</h3>
        <p>
          By accessing and using pixaredu.com (the "Site"), you agree to be bound by these Terms and Conditions. If you do not agree with all of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
        </p>

        <h3>2. Services</h3>
        <p>
          Pixar Educational Consultancy provides counseling, test preparation, application assistance, and visa guidance services ("Services"). Our services are provided based on the information you provide to us. We do not guarantee admission to any institution or the approval of any visa application, as these decisions are at the sole discretion of the respective authorities.
        </p>

        <h3>3. User Responsibilities</h3>
        <p>
          You agree to provide accurate, current, and complete information as required for our Services. You are responsible for the authenticity of all documents submitted. Providing fraudulent information or documents may result in legal consequences and termination of our Services without a refund.
        </p>

        <h3>4. Intellectual Property</h3>
        <p>
          The Site and its original content, features, and functionality are owned by Pixar Educational Consultancy and are protected by international copyright, trademark, and other intellectual property laws.
        </p>

        <h3>5. Limitation of Liability</h3>
        <p>
          In no event shall Pixar Educational Consultancy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h3>6. Changes to Terms</h3>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h3>7. Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.
        </p>

        <h3>Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us at info@pixaredu.com.
        </p>
      </div>
    </div>
  );
}
