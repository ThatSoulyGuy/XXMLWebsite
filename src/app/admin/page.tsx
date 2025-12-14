import { getAdminStats } from "@/actions/admin";
import { Users, FileText, AlertCircle, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      name: "Total Users",
      value: stats.userCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Total Posts",
      value: stats.postCount,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      name: "Total Issues",
      value: stats.issueCount,
      icon: AlertCircle,
      color: "bg-amber-500",
    },
    {
      name: "Total Comments",
      value: stats.commentCount,
      icon: MessageSquare,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Overview
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Site statistics and quick actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Distribution */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          User Roles
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: "USER", label: "Users", color: "bg-zinc-500" },
            { role: "DEVELOPER", label: "Developers", color: "bg-green-500" },
            { role: "MODERATOR", label: "Moderators", color: "bg-green-600" },
            { role: "ADMIN", label: "Admins", color: "bg-red-500" },
          ].map((item) => (
            <div
              key={item.role}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <div className={`h-3 w-3 rounded-full ${item.color}`} />
              <div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {stats.roleDistribution[item.role] || 0}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
