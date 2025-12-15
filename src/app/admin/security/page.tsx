import { Metadata } from "next";
import { SecurityDashboard } from "./security-dashboard";

export const metadata: Metadata = {
  title: "Security - Admin",
};

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Security Dashboard
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Monitor threats, manage blocked IPs, and view security statistics
        </p>
      </div>

      <SecurityDashboard />
    </div>
  );
}
