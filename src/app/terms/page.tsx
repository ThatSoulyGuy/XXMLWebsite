import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the XXML Programming Language website.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
          >
            &larr; Back to Home
          </Link>
        </div>

        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-cyan-600 dark:prose-a:text-cyan-400">
          <h1>Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the XXML Programming Language website at{" "}
            <a href="https://xxml-language.com">https://xxml-language.com</a> (the &quot;Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not access or use the Site.
          </p>

          <h2>2. Intellectual Property Rights</h2>

          <h3>2.1 Ownership</h3>
          <p>
            The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, audio, design, selection, and arrangement thereof) are owned by Eric &quot;ThatSoulyGuy&quot; Phillips and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h3>2.2 All Rights Reserved</h3>
          <p>
            All rights not expressly granted herein are reserved. No part of this Site may be reproduced, distributed, modified, transmitted, reused, downloaded, reposted, or otherwise used without the prior written permission of Eric &quot;ThatSoulyGuy&quot; Phillips, except as expressly permitted by these Terms.
          </p>

          <h3>2.3 XXML Programming Language</h3>
          <p>
            The XXML programming language, including its compiler, standard library, documentation, and related tools, is proprietary software. All rights to the XXML programming language are reserved by Eric &quot;ThatSoulyGuy&quot; Phillips unless otherwise specified in a separate license agreement.
          </p>

          <h2>3. User Accounts</h2>

          <h3>3.1 Account Creation</h3>
          <p>
            To access certain features of the Site, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
          </p>

          <h3>3.2 Account Security</h3>
          <p>
            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>

          <h3>3.3 Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </p>

          <h2>4. User Content</h2>

          <h3>4.1 Content You Submit</h3>
          <p>
            You may submit content to the Site, including forum posts, issue reports, and comments (&quot;User Content&quot;). You retain ownership of your User Content, but by submitting it, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your User Content in connection with the Site.
          </p>

          <h3>4.2 Content Standards</h3>
          <p>User Content must not:</p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Infringe any intellectual property or other rights of any person</li>
            <li>Contain defamatory, obscene, offensive, or hateful material</li>
            <li>Promote violence or discrimination</li>
            <li>Contain spam, malware, or deceptive content</li>
            <li>Impersonate any person or misrepresent your affiliation</li>
          </ul>

          <h3>4.3 Content Moderation</h3>
          <p>
            We reserve the right to remove, edit, or refuse to post any User Content for any reason at our sole discretion. We are not responsible for any User Content posted by users.
          </p>

          <h2>5. Prohibited Uses</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site in any way that violates any applicable law or regulation</li>
            <li>Attempt to gain unauthorized access to the Site or its related systems</li>
            <li>Interfere with or disrupt the Site or servers connected to the Site</li>
            <li>Use any automated means to access the Site without our permission</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Site</li>
            <li>Remove any copyright or proprietary notices from the Site</li>
            <li>Use the Site to transmit any malicious code or harmful content</li>
          </ul>

          <h2>6. Disclaimers</h2>

          <h3>6.1 As-Is Basis</h3>
          <p>
            THE SITE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h3>6.2 No Guarantee</h3>
          <p>
            We do not warrant that the Site will be uninterrupted, secure, or error-free, that defects will be corrected, or that the Site or its servers are free of viruses or other harmful components.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, ERIC &quot;THATSOULYGUY&quot; PHILLIPS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul>
            <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SITE</li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SITE</li>
            <li>ANY CONTENT OBTAINED FROM THE SITE</li>
            <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
          </ul>

          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Eric &quot;ThatSoulyGuy&quot; Phillips from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with your access to or use of the Site or your violation of these Terms.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Site after any changes constitutes acceptance of the new Terms.
          </p>

          <h2>11. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
          </p>

          <h2>12. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Eric &quot;ThatSoulyGuy&quot; Phillips regarding the Site and supersede all prior agreements and understandings.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact:
          </p>
          <p>
            <strong>Eric &quot;ThatSoulyGuy&quot; Phillips</strong>
            <br />
            Email:{" "}
            <a href="mailto:phillipseric417@gmail.com">phillipseric417@gmail.com</a>
          </p>
        </article>
      </div>
    </div>
  );
}
