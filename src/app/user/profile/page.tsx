import { getProfile } from "@/actions/account";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Profile",
  description: "Manage your profile settings",
};

function formatGender(gender: string | null): string {
  if (!gender) return "Not specified";
  const map: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Prefer not to say",
  };
  return map[gender] || gender;
}

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Profile
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Manage your public profile information.
        </p>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <ProfileForm profile={profile} />
      </div>

      <div className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Account Information
        </h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Email
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {profile.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Role
            </dt>
            <dd className="mt-1">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {profile.role}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Gender
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {formatGender(profile.gender)}
            </dd>
          </div>
          {profile.birthdate && (
            <div>
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Age
              </dt>
              <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
                {calculateAge(new Date(profile.birthdate))} years old
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Member since
            </dt>
            <dd className="mt-1 text-zinc-900 dark:text-zinc-100">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
