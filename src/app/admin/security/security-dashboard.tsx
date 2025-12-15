"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, ShieldAlert, ShieldCheck, Ban, RefreshCw, Clock, Activity } from "lucide-react";

interface SecurityStats {
  blockedIPs: number;
  trackedThreats: number;
  rateLimitEntries: number;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  type: "block" | "threat" | "rate_limit";
  ip: string;
  reason: string;
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockIp, setBlockIp] = useState("");
  const [blockDuration, setBlockDuration] = useState("3600000");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/security");
      if (!response.ok) {
        throw new Error("Failed to fetch security stats");
      }
      const data = await response.json();
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleBlockIP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockIp.trim()) return;

    setActionLoading(true);
    setActionMessage(null);

    try {
      const response = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "block",
          ip: blockIp.trim(),
          duration: blockDuration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to block IP");
      }

      setActionMessage({ type: "success", text: data.message });
      setBlockIp("");
      fetchStats();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to block IP",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockIP = async (ip: string) => {
    setActionLoading(true);
    setActionMessage(null);

    try {
      const response = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unblock",
          ip,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unblock IP");
      }

      setActionMessage({ type: "success", text: data.message });
      fetchStats();
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to unblock IP",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 text-sm text-red-600 hover:underline dark:text-red-400"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
              <Ban className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats?.blockedIPs || 0}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Blocked IPs
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats?.trackedThreats || 0}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Tracked Threats
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stats?.rateLimitEntries || 0}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Rate Limit Entries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div
          className={`rounded-lg border p-4 ${
            actionMessage.type === "success"
              ? "border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950 dark:text-green-400"
              : "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Block IP Form */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Block IP Address
        </h3>
        <form onSubmit={handleBlockIP} className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="ip" className="sr-only">
              IP Address
            </label>
            <input
              type="text"
              id="ip"
              value={blockIp}
              onChange={(e) => setBlockIp(e.target.value)}
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="duration" className="sr-only">
              Duration
            </label>
            <select
              id="duration"
              value={blockDuration}
              onChange={(e) => setBlockDuration(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="300000">5 minutes</option>
              <option value="900000">15 minutes</option>
              <option value="1800000">30 minutes</option>
              <option value="3600000">1 hour</option>
              <option value="86400000">24 hours</option>
              <option value="604800000">7 days</option>
              <option value="2592000000">30 days</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={actionLoading || !blockIp.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900"
          >
            <Ban className="h-4 w-4" />
            Block IP
          </button>
        </form>
      </div>

      {/* Security Status */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Security Status
          </h3>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-600 dark:text-green-400">
                Security Systems Active
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                Rate limiting, threat detection, and DDoS protection are enabled
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Middleware Protection</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Path filtering, user-agent blocking, edge rate limiting
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Rate Limits</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                100 req/min global, 50 req/sec burst, per-action limits
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <ShieldAlert className="h-4 w-4" />
                <span className="font-medium">Threat Detection</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Auto-blocking at score 100, 35+ blocked path patterns
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Ban className="h-4 w-4" />
                <span className="font-medium">Blocked Content</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                22+ malicious user agents, attack tool signatures
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Headers Info */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Active Security Headers
        </h3>
        <div className="space-y-2 text-sm">
          {[
            { header: "X-Frame-Options", value: "DENY" },
            { header: "X-Content-Type-Options", value: "nosniff" },
            { header: "X-XSS-Protection", value: "1; mode=block" },
            { header: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
            { header: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { header: "Content-Security-Policy", value: "default-src 'self'; ..." },
            { header: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ].map((item) => (
            <div
              key={item.header}
              className="flex items-center justify-between rounded border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <span className="font-mono text-zinc-600 dark:text-zinc-400">
                {item.header}
              </span>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
