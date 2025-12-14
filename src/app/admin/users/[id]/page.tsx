import { getUserById } from "@/actions/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { UserEditForm } from "./user-edit-form";
import { ArrowLeft } from "lucide-react";

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: UserEditPageProps) {
  const { id } = await params;
  try {
    const user = await getUserById(id);
    return {
      title: `Edit ${user.name || user.email}`,
    };
  } catch {
    return { title: "User Not Found" };
  }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params;

  let user;
  try {
    user = await getUserById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      </div>

      {/* User Header */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <Avatar src={user.image} name={user.name || user.email} size="lg" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {user.name || "No name set"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">{user.email}</p>
            {user.username && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                @{user.username}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
            <p>Joined {formatDate(user.createdAt)}</p>
            <p>Updated {formatDate(user.updatedAt)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {user._count.posts}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {user._count.issues}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Issues</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {user._count.issueComments}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Issue Comments
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {user._count.postComments}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Post Comments
            </p>
          </div>
        </div>

        {/* OAuth Providers */}
        {user.accounts.length > 0 && (
          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Connected Accounts
            </p>
            <div className="flex gap-2">
              {user.accounts.map((account) => (
                <span
                  key={account.provider}
                  className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
                >
                  {account.provider}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Form */}
      <UserEditForm user={user} />
    </div>
  );
}
