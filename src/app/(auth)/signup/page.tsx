import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Sign Up",
  description: "Create a new XXML account",
};

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black">Create an account</CardTitle>
        <CardDescription>Join the XXML community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">Or</span>
          </div>
        </div>

        <Link
          href="/signup/email"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-transparent px-4 py-2.5 font-semibold text-slate-900 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 dark:text-white"
        >
          <Mail className="h-4 w-4" />
          Continue with Email
        </Link>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-600 hover:underline dark:text-cyan-400">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
