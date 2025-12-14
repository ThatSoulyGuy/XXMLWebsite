"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, checkUsernameAvailable } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name || "");
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges =
    name !== (profile.name || "") ||
    username !== (profile.username || "") ||
    bio !== (profile.bio || "");

  useEffect(() => {
    // Skip check if username unchanged
    if (username === profile.username) {
      setIsUsernameAvailable(true);
      setUsernameError(null);
      return;
    }

    const checkAvailability = async () => {
      if (username.length < 3) {
        setIsUsernameAvailable(null);
        setUsernameError(
          username.length > 0 ? "Username must be at least 3 characters" : null
        );
        return;
      }

      setIsCheckingUsername(true);
      setUsernameError(null);

      const result = await checkUsernameAvailable(username);

      if (result.error) {
        setUsernameError(result.error);
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(result.available);
        if (!result.available) {
          setUsernameError("Username is already taken");
        }
      }

      setIsCheckingUsername(false);
    };

    const debounce = setTimeout(checkAvailability, 300);
    return () => clearTimeout(debounce);
  }, [username, profile.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || isSubmitting) return;
    if (username !== profile.username && !isUsernameAvailable) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile({
      name,
      username,
      bio: bio || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Display Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="Your display name"
        />
      </div>

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
            className="block w-full rounded-lg border border-zinc-300 bg-white py-2 pl-8 pr-10 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="username"
          />
          {username !== profile.username && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername && (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              )}
              {!isCheckingUsername && isUsernameAvailable === true && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {!isCheckingUsername && isUsernameAvailable === false && (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        {usernameError && (
          <p className="mt-1 text-sm text-red-500">{usernameError}</p>
        )}
        <p className="mt-1 text-xs text-zinc-500">
          3-20 characters, letters, numbers, underscores, and hyphens only
        </p>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="mt-1 block w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
        <p className="mt-1 text-xs text-zinc-500">{bio.length}/500 characters</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/50 dark:text-green-400">
          Profile updated successfully!
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={
            !hasChanges ||
            isSubmitting ||
            (username !== profile.username && !isUsernameAvailable)
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {hasChanges && (
          <button
            type="button"
            onClick={() => {
              setName(profile.name || "");
              setUsername(profile.username || "");
              setBio(profile.bio || "");
            }}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
