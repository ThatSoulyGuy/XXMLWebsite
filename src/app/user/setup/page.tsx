"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setupUsername, checkUsernameAvailable } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

export default function AccountSetupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (username.length < 3) {
        setIsAvailable(null);
        setValidationError(
          username.length > 0 ? "Username must be at least 3 characters" : null
        );
        return;
      }

      setIsChecking(true);
      setValidationError(null);

      const result = await checkUsernameAvailable(username);

      if (result.error) {
        setValidationError(result.error);
        setIsAvailable(false);
      } else {
        setIsAvailable(result.available);
        if (!result.available) {
          setValidationError("Username is already taken");
        }
      }

      setIsChecking(false);
    };

    const debounce = setTimeout(checkAvailability, 300);
    return () => clearTimeout(debounce);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const result = await setupUsername(username);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/user/profile");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Welcome to XXML!
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Choose a username to get started. This will be your unique handle on
            the platform.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Username
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                  }
                  placeholder="username"
                  className="block w-full rounded-lg border border-zinc-300 bg-white py-2 pl-8 pr-10 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  autoFocus
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking && (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  )}
                  {!isChecking && isAvailable === true && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {!isChecking && isAvailable === false && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              {validationError && (
                <p className="mt-1 text-sm text-red-500">{validationError}</p>
              )}
              <p className="mt-1 text-xs text-zinc-500">
                3-20 characters, letters, numbers, underscores, and hyphens only
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isAvailable || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
