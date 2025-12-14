"use client";

import { useActionState } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

export function EmailSignupForm() {
  const [state, formAction, isPending] = useActionState(signup, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="handle">Handle</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
            <Input
              id="handle"
              name="handle"
              type="text"
              placeholder="username"
              required
              className="pl-8"
              autoComplete="username"
            />
          </div>
          <p className="text-xs text-slate-500">Letters, numbers, and underscores only</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 transition-all hover:border-cyan-500/50 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/10 dark:border-slate-700 dark:hover:border-cyan-500/50"
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                required
                className="h-4 w-4 accent-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <p className="text-xs text-slate-500">
          Must contain uppercase, lowercase, and a number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Confirm your password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending} isLoading={isPending}>
        Create account
      </Button>
    </form>
  );
}
