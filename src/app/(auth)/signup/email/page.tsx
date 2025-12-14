import Link from "next/link";
import { EmailSignupForm } from "@/components/auth/email-signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sign Up with Email",
  description: "Create a new XXML account with email",
};

export default function EmailSignupPage() {
  return (
    <Card>
      <CardHeader>
        <Link
          href="/signup"
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-cyan-500 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up options
        </Link>
        <CardTitle className="text-2xl font-black">Create your account</CardTitle>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <EmailSignupForm />
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-600 hover:underline dark:text-cyan-400">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
