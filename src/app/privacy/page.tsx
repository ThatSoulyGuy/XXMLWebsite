import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the XXML Programming Language website.",
};

export default function PrivacyPolicyPage() {
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
          <h1>Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: December 14, 2024
          </p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to the XXML Programming Language website (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at{" "}
            <a href="https://xxml-language.com">https://xxml-language.com</a> (the &quot;Site&quot;).
          </p>
          <p>
            By accessing or using the Site, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Site.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide when you:</p>
          <ul>
            <li>Create an account on our Site</li>
            <li>Sign in using third-party authentication providers (Google, GitHub)</li>
            <li>Post content in our forums or issue tracker</li>
            <li>Contact us directly</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name and username</li>
            <li>Email address</li>
            <li>Profile picture (if provided by authentication provider)</li>
            <li>Gender (if you choose to share this from your Google account)</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>
            When you access the Site, we may automatically collect certain information about your device and usage, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>

          <h2>3. Google User Data</h2>
          <p>
            This section specifically addresses how we handle data obtained through Google Sign-In, in compliance with Google&apos;s API Services User Data Policy.
          </p>

          <h3>3.1 Data We Access from Google</h3>
          <p>When you sign in with Google, we request access to the following information:</p>
          <ul>
            <li><strong>Basic Profile Information:</strong> Your name, email address, and profile picture</li>
            <li><strong>Gender (optional):</strong> Your gender, if you have set this in your Google account and choose to share it</li>
          </ul>

          <h3>3.2 How We Use Google User Data</h3>
          <p>We use Google user data exclusively for the following purposes:</p>
          <ul>
            <li><strong>Authentication:</strong> To verify your identity and create/access your account on our Site</li>
            <li><strong>Profile Display:</strong> To display your name and profile picture on your public profile and alongside your posts and comments</li>
            <li><strong>Personalization:</strong> To personalize your experience on the Site (e.g., using your preferred name in greetings)</li>
            <li><strong>Communication:</strong> To send you account-related notifications to your email address</li>
          </ul>

          <h3>3.3 How We Store Google User Data</h3>
          <p>
            Google user data is stored securely in our database. We implement industry-standard security measures including:
          </p>
          <ul>
            <li>Encrypted database connections</li>
            <li>Access controls limiting who can view user data</li>
            <li>Regular security updates and monitoring</li>
          </ul>
          <p>
            We retain your Google user data for as long as your account remains active. You may request deletion of your account and all associated data at any time by contacting us.
          </p>

          <h3>3.4 How We Share Google User Data</h3>
          <p>
            <strong>We do not sell, trade, or transfer your Google user data to third parties.</strong>
          </p>
          <p>Your Google user data may be visible to other users in the following limited ways:</p>
          <ul>
            <li>Your name and profile picture are displayed on your public profile</li>
            <li>Your name and profile picture appear alongside posts and comments you make</li>
          </ul>
          <p>
            We do not share your email address publicly. Your email is only used for authentication and account-related communications.
          </p>

          <h3>3.5 Limited Use Disclosure</h3>
          <p>
            XXML&apos;s use and transfer to any other app of information received from Google APIs will adhere to{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>

          <h3>3.6 Revoking Access</h3>
          <p>
            You can revoke XXML&apos;s access to your Google account data at any time by:
          </p>
          <ul>
            <li>Visiting your{" "}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                Google Account Permissions
              </a>
            </li>
            <li>Finding &quot;XXML&quot; in the list of apps with access</li>
            <li>Clicking &quot;Remove Access&quot;</li>
          </ul>
          <p>
            After revoking access, you may also contact us to request deletion of your account and associated data.
          </p>

          <h2>4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain the Site</li>
            <li>Create and manage your account</li>
            <li>Enable user-to-user communications through forums and issue tracking</li>
            <li>Respond to your inquiries and provide support</li>
            <li>Monitor and analyze usage patterns to improve the Site</li>
            <li>Protect against unauthorized access and abuse</li>
          </ul>

          <h2>5. Third-Party Authentication</h2>
          <p>
            We offer sign-in through third-party providers (Google and GitHub). When you authenticate using these services, we receive limited information from your account as permitted by your privacy settings with those providers. We do not have access to your passwords for these services.
          </p>

          <h2>6. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data by contacting us at{" "}
            <a href="mailto:phillipseric417@gmail.com">phillipseric417@gmail.com</a>.
          </p>

          <h2>8. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Data portability</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:phillipseric417@gmail.com">phillipseric417@gmail.com</a>.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Site is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information promptly.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices, please contact:
          </p>
          <p>
            <strong>Eric &quot;ThatSoulyGuy&quot; Phillips</strong>
            <br />
            Email:{" "}
            <a href="mailto:phillipseric417@gmail.com">phillipseric417@gmail.com</a>
          </p>

          <h2>12. All Rights Reserved</h2>
          <p>
            All content, trademarks, and intellectual property on this Site are the exclusive property of Eric &quot;ThatSoulyGuy&quot; Phillips and are protected by applicable copyright and trademark laws. Unauthorized use, reproduction, or distribution of any content from this Site is strictly prohibited.
          </p>
        </article>
      </div>
    </div>
  );
}
