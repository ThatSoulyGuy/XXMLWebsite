"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding, checkUsernameAvailable, getOnboardingData } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, ArrowRight, ArrowLeft, User, FileText, Sparkles, ShieldCheck, AlertTriangle, Calendar, UserCircle, Github } from "lucide-react";

type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

type Step = { id: string; title: string; icon: React.ComponentType<{ className?: string }> };

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

function formatGender(gender: string): string {
  const map: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Not specified",
  };
  return map[gender] || gender;
}

export default function AccountSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form data
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [birthdate, setBirthdate] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [userAge, setUserAge] = useState<number | null>(null);
  const [isUnderage, setIsUnderage] = useState(false);
  const [hasOAuthData, setHasOAuthData] = useState(false);
  const [needsPersonalInfo, setNeedsPersonalInfo] = useState(false);

  // Username validation
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic steps based on what data is missing
  const steps = useMemo<Step[]>(() => {
    const baseSteps: Step[] = [
      { id: "welcome", title: "Welcome", icon: Sparkles },
    ];

    if (needsPersonalInfo) {
      baseSteps.push({ id: "personal", title: "About You", icon: UserCircle });
    }

    baseSteps.push(
      { id: "handle", title: "Handle", icon: User },
      { id: "bio", title: "Bio", icon: FileText }
    );

    return baseSteps;
  }, [needsPersonalInfo]);

  // Load existing user data
  useEffect(() => {
    const loadData = async () => {
      const data = await getOnboardingData();
      if (data) {
        setUserName(data.name || "");
        setUserImage(data.image || "");
        if (data.gender) {
          setGender(data.gender as Gender);
        }
        if (data.birthdate) {
          const age = calculateAge(new Date(data.birthdate));
          setUserAge(age);
          if (age < 13) {
            setIsUnderage(true);
          }
        }
        // Check if we have OAuth-provided data (Google provides gender/birthdate, GitHub doesn't)
        if (data.gender && data.birthdate) {
          setHasOAuthData(true);
          setNeedsPersonalInfo(false);
        } else {
          // GitHub user or missing data - need to ask for gender/birthdate
          setNeedsPersonalInfo(true);
          setHasOAuthData(!!data.name); // Still have name from GitHub
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Check username availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (username.length < 3) {
        setIsAvailable(null);
        setValidationError(
          username.length > 0 ? "Username must be at least 3 characters" : null
        );
        return;
      }

      if (username.length > 20) {
        setIsAvailable(null);
        setValidationError("Username must be at most 20 characters");
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setIsAvailable(null);
        setValidationError("Only letters, numbers, underscores, and hyphens");
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

  // Get current step id
  const currentStepId = steps[currentStep]?.id;

  // Track if user attempted to proceed (for showing validation errors)
  const [attemptedProceed, setAttemptedProceed] = useState(false);

  // Calculate age from birthdate input
  const inputAge = useMemo(() => {
    if (!birthdate) return null;
    const bd = new Date(birthdate);
    if (isNaN(bd.getTime())) return null;
    return calculateAge(bd);
  }, [birthdate]);

  // Validate age (between 13 and 150 years)
  const ageValidation = useMemo(() => {
    if (inputAge === null) return { valid: false, error: null };
    if (inputAge < 13) return { valid: false, error: "underage" };
    if (inputAge > 150) return { valid: false, error: "invalid" };
    return { valid: true, error: null };
  }, [inputAge]);

  // Reset attemptedProceed when birthdate changes
  useEffect(() => {
    setAttemptedProceed(false);
  }, [birthdate]);

  const handleSubmit = async () => {
    if (!isAvailable || isSubmitting || isUnderage) return;

    setIsSubmitting(true);
    setError(null);

    const result = await completeOnboarding({
      username,
      bio: bio || undefined,
      gender: gender || undefined,
      birthdate: birthdate || undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      // Refresh the session to update JWT with new username
      // This is necessary because middleware runs in Edge runtime where Prisma doesn't work
      try {
        const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" });
        if (!refreshResponse.ok) {
          console.error("Failed to refresh session");
        }
      } catch (e) {
        console.error("Session refresh error:", e);
      }

      // Navigate to profile with fresh JWT
      window.location.href = "/user/profile";
    }
  };

  const canProceed = () => {
    if (isUnderage) return false;

    // Personal info step - need gender and valid birthdate
    if (currentStepId === "personal") {
      if (!gender) return false;
      if (!birthdate) return false;
      if (!ageValidation.valid) return false;
      return true;
    }

    // Handle step - need available username
    if (currentStepId === "handle") {
      return isAvailable === true;
    }

    return true;
  };

  const nextStep = () => {
    // Mark that user attempted to proceed (to show validation errors)
    if (currentStepId === "personal") {
      setAttemptedProceed(true);

      // Check for age validation errors
      if (ageValidation.error === "underage") {
        setIsUnderage(true);
        return;
      }
      if (!ageValidation.valid) {
        return;
      }
    }

    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  // Show underage block screen
  if (isUnderage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-900/20">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-6 text-2xl font-bold text-red-700 dark:text-red-400">
              Age Requirement Not Met
            </h1>
            <p className="mt-4 text-red-600 dark:text-red-300">
              You must be at least 13 years old to use XXML. This is required to comply with privacy regulations.
            </p>
            <p className="mt-4 text-sm text-red-500 dark:text-red-400">
              If you believe this is an error, please contact us at{" "}
              <a href="mailto:phillipseric417@gmail.com" className="underline">
                phillipseric417@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    index < currentStep
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : index === currentStep
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-500"
                      : "border-zinc-300 text-zinc-400 dark:border-zinc-700"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-8 transition-all sm:w-12 ${
                      index < currentStep ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
          {/* Welcome Step */}
          {currentStepId === "welcome" && (
            <div className="text-center">
              {userImage && (
                <img
                  src={userImage}
                  alt="Profile"
                  className="mx-auto mb-6 h-24 w-24 rounded-full border-4 border-cyan-500/20"
                />
              )}
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Welcome to XXML{userName ? `, ${userName.split(" ")[0]}` : ""}!
              </h1>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Let&apos;s set up your profile. This will only take a moment.
              </p>

              {/* Show imported profile data (Google users with full data) */}
              {hasOAuthData && !needsPersonalInfo && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Imported from your Google account:
                  </p>
                  <div className="space-y-2 rounded-lg border border-white/20 bg-white/50 p-4 text-left backdrop-blur-sm dark:border-white/10 dark:bg-zinc-800/50">
                    {userName && (
                      <div className="flex items-center gap-3 text-sm">
                        <UserCircle className="h-4 w-4 text-cyan-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{userName}</span>
                      </div>
                    )}
                    {gender && (
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-cyan-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">Gender:</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatGender(gender)}</span>
                      </div>
                    )}
                    {userAge !== null && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-cyan-500" />
                        <span className="text-zinc-600 dark:text-zinc-400">Age:</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{userAge} years old</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show GitHub user message */}
              {needsPersonalInfo && userName && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Github className="h-4 w-4" />
                    <span>Signed in as {userName}</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    We&apos;ll need a few more details to complete your profile.
                  </p>
                </div>
              )}

              {/* Age verification status (Google users) */}
              {userAge !== null && userAge >= 13 && !needsPersonalInfo && (
                <div className="mt-4 rounded-lg border border-green-200/50 bg-green-50/80 p-3 backdrop-blur-sm dark:border-green-500/20 dark:bg-green-900/30">
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      Age verified
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                You can update these details later in your profile settings.
              </p>
            </div>
          )}

          {/* Personal Info Step (for GitHub users) */}
          {currentStepId === "personal" && (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Tell us about yourself
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                We need a few details to personalize your experience.
              </p>

              <div className="mt-6 space-y-6">
                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Gender
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                          gender === g
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                            : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        {formatGender(g)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birthdate Input */}
                <div>
                  <label
                    htmlFor="birthdate"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    Required for age verification (must be 13+)
                  </p>
                </div>

                {/* Age verification status - only show when valid */}
                {ageValidation.valid && inputAge !== null && (
                  <div className="rounded-lg border border-green-200/50 bg-green-50/80 p-3 backdrop-blur-sm dark:border-green-500/20 dark:bg-green-900/30">
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Age verified ({inputAge} years old)
                      </p>
                    </div>
                  </div>
                )}

                {/* Underage warning - only show after attempting to proceed */}
                {attemptedProceed && ageValidation.error === "underage" && (
                  <div className="rounded-lg border border-red-200/50 bg-red-50/80 p-3 backdrop-blur-sm dark:border-red-500/20 dark:bg-red-900/30">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        You must be at least 13 years old
                      </p>
                    </div>
                  </div>
                )}

                {/* Invalid age warning (ridiculous dates like year 0001) */}
                {attemptedProceed && ageValidation.error === "invalid" && (
                  <div className="rounded-lg border border-red-200/50 bg-red-50/80 p-3 backdrop-blur-sm dark:border-red-500/20 dark:bg-red-900/30">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Please enter a valid date of birth
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Handle Step */}
          {currentStepId === "handle" && (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Choose your handle
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                This is your unique identifier on XXML. Others will see this when you post or comment.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Username
                </label>
                <div className="relative mt-2">
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
                    placeholder="your_username"
                    className="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-8 pr-10 text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    autoFocus
                    autoComplete="off"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking && (
                      <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                    )}
                    {!isChecking && isAvailable === true && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {!isChecking && isAvailable === false && (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                {validationError && (
                  <p className="mt-2 text-sm text-red-500">{validationError}</p>
                )}
                {isAvailable && (
                  <p className="mt-2 text-sm text-green-500">Username is available!</p>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  3-20 characters. Letters, numbers, underscores, and hyphens only.
                </p>
              </div>
            </div>
          )}

          {/* Bio Step */}
          {currentStepId === "bio" && (
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Tell us about yourself
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Add a short bio to let others know who you are. This is optional.
              </p>

              <div className="mt-6">
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
                  placeholder="Write a short bio about yourself..."
                  rows={4}
                  maxLength={500}
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <p className="mt-2 text-right text-xs text-zinc-500">
                  {bio.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skip link */}
        {currentStepId === "bio" && (
          <p className="mt-4 text-center text-sm text-zinc-500">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isAvailable || isSubmitting}
              className="text-cyan-600 hover:text-cyan-500 disabled:opacity-50 dark:text-cyan-400"
            >
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
