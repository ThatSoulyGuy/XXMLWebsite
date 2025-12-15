import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

export const metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Manage your account preferences and settings.
        </p>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Customize how the site looks for you.
        </p>
        <div className="mt-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Theme settings follow your system preferences automatically.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Notifications
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Configure how you receive notifications.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Email notifications for issue replies
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Email notifications for post replies
            </span>
          </label>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Note: Notification preferences are not yet functional. Coming soon!
        </p>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Session
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your current session.
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>

      <div className="rounded-xl border border-red-300/30 bg-red-50/70 p-6 shadow-lg backdrop-blur-xl dark:border-red-500/20 dark:bg-red-950/40">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Irreversible and destructive actions.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="rounded-lg border border-red-300/50 bg-white/80 px-4 py-2 text-sm font-medium text-red-600 backdrop-blur-sm transition-colors hover:bg-red-50 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
            disabled
          >
            Delete Account
          </button>
          <p className="mt-2 text-xs text-red-500 dark:text-red-400">
            Account deletion is not yet available. Contact an administrator if
            you need to delete your account.
          </p>
        </div>
      </div>
    </div>
  );
}
