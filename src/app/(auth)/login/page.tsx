import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Log In",
  description: "Sign in to your XXML account",
};

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "An account with this email already exists using a different sign-in method. Please sign in with your original method.",
  OAuthSignin: "Error starting the sign-in process. Please try again.",
  OAuthCallback: "Error during sign-in callback. Please try again.",
  OAuthCreateAccount: "Could not create account. Please try again.",
  EmailCreateAccount: "Could not create account. Please try again.",
  Callback: "Error during sign-in. Please try again.",
  OAuthSigninMismatch: "The sign-in request has expired. Please try again.",
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to access this page.",
  Configuration: "There was a problem with the authentication configuration. Please try again.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The verification link has expired or has already been used.",
  Default: "An error occurred during sign-in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const errorMessage = error ? (ERROR_MESSAGES[error] || ERROR_MESSAGES.Default) : null;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your XXML account</CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200/50 bg-red-50/80 p-4 backdrop-blur-sm dark:border-red-500/20 dark:bg-red-900/30">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        )}
        <LoginForm />
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
