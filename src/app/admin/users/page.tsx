import { getAllUsers } from "@/actions/admin";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Shield, Code, Users, User, Pencil } from "lucide-react";

export const metadata = {
  title: "Manage Users",
};

const roleIcons: Record<string, typeof Shield> = {
  ADMIN: Shield,
  MODERATOR: Users,
  DEVELOPER: Code,
  USER: User,
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
  MODERATOR: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
  DEVELOPER: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
  USER: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Users
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {users.length} registered users
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Auth
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const RoleIcon = roleIcons[user.role] || User;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.image}
                          name={user.name || user.email}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            {user.name || "No name"}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {user.username ? `@${user.username}` : user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.role]}`}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.hasPassword
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400"
                        }`}
                      >
                        {user.hasPassword ? "Password" : "OAuth"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        <p>{user._count.posts} posts</p>
                        <p>{user._count.issues} issues</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
