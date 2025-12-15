/**
 * Enterprise-grade rate limiting and DDoS protection for Next.js.
 * Uses sliding window algorithm with IP tracking and threat detection.
 *
 * Note: For production deployments with multiple instances, consider using
 * Redis or a similar distributed cache for rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface ThreatEntry {
  score: number;
  lastSeen: number;
  blocked: boolean;
  blockedUntil: number;
  violations: string[];
}

// In-memory stores
const rateLimitStore = new Map<string, RateLimitEntry>();
const threatStore = new Map<string, ThreatEntry>();
const blockedIPs = new Set<string>();

// Suspicious patterns that increase threat score
const SUSPICIOUS_PATHS = [
  /\.env/i,
  /\.git/i,
  /\.svn/i,
  /wp-admin/i,
  /wp-login/i,
  /wp-content/i,
  /xmlrpc\.php/i,
  /phpmyadmin/i,
  /admin\.php/i,
  /shell/i,
  /cmd/i,
  /eval/i,
  /exec/i,
  /passwd/i,
  /etc\/shadow/i,
  /\.sql/i,
  /backup/i,
  /dump/i,
  /config\.php/i,
  /setup\.php/i,
  /install\.php/i,
];

const SUSPICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /wpscan/i,
  /hydra/i,
  /metasploit/i,
  /burp/i,
  /python-requests/i, // Often used for automated attacks
  /curl\/\d/i, // Scripted curl (but be careful, legitimate uses too)
];

// Cleanup interval to prevent memory leaks (runs every 5 minutes)
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
    // Clean up old threat entries (older than 1 hour)
    for (const [ip, entry] of threatStore) {
      if (entry.lastSeen < now - 3600000 && !entry.blocked) {
        threatStore.delete(ip);
      }
      // Unblock IPs after their block period
      if (entry.blocked && entry.blockedUntil < now) {
        entry.blocked = false;
        blockedIPs.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

startCleanup();

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
  /** Identifier prefix for this limiter (e.g., "login", "signup") */
  prefix: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds?: number;
}

/**
 * Check if a request should be rate limited.
 *
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Result indicating if the request is allowed
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const existing = rateLimitStore.get(key);

  // If no existing entry or window has expired, create new entry
  if (!existing || existing.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetTime: now + windowMs,
    };
  }

  // Increment count
  existing.count++;
  rateLimitStore.set(key, existing);

  // Check if over limit
  if (existing.count > config.limit) {
    const retryAfterSeconds = Math.ceil((existing.resetTime - now) / 1000);
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfterSeconds,
    };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const RateLimiters = {
  /** Authentication attempts: 5 per minute per IP */
  auth: {
    limit: 5,
    windowSeconds: 60,
    prefix: "auth",
  } as RateLimitConfig,

  /** Account creation: 3 per hour per IP */
  signup: {
    limit: 3,
    windowSeconds: 3600,
    prefix: "signup",
  } as RateLimitConfig,

  /** Post creation: 10 per minute per user */
  createPost: {
    limit: 10,
    windowSeconds: 60,
    prefix: "create-post",
  } as RateLimitConfig,

  /** Comment creation: 20 per minute per user */
  createComment: {
    limit: 20,
    windowSeconds: 60,
    prefix: "create-comment",
  } as RateLimitConfig,

  /** Issue creation: 5 per minute per user */
  createIssue: {
    limit: 5,
    windowSeconds: 60,
    prefix: "create-issue",
  } as RateLimitConfig,

  /** Download creation (admin): 30 per minute */
  createDownload: {
    limit: 30,
    windowSeconds: 60,
    prefix: "create-download",
  } as RateLimitConfig,

  /** API requests: 100 per minute per IP */
  api: {
    limit: 100,
    windowSeconds: 60,
    prefix: "api",
  } as RateLimitConfig,

  /** Sensitive operations: 3 per minute per user */
  sensitive: {
    limit: 3,
    windowSeconds: 60,
    prefix: "sensitive",
  } as RateLimitConfig,
} as const;

/**
 * Get client IP address from headers.
 * Works with common proxy setups (Vercel, Cloudflare, nginx).
 */
export function getClientIp(headers: Headers): string {
  // Try common headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (client IP) from the chain
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback for development
  return "127.0.0.1";
}

/**
 * Rate limit error that can be thrown in server actions
 */
export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super(`Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Helper to apply rate limiting in server actions.
 * Throws RateLimitError if limit is exceeded.
 *
 * @param identifier - Unique identifier for the client
 * @param config - Rate limit configuration
 * @throws RateLimitError if rate limit is exceeded
 */
export function applyRateLimit(identifier: string, config: RateLimitConfig): void {
  const result = checkRateLimit(identifier, config);
  if (!result.success) {
    throw new RateLimitError(result.retryAfterSeconds || 60);
  }
}

/**
 * Handle rate limit errors and return appropriate response.
 * Useful in server actions.
 */
export function handleRateLimitError(error: unknown): { error: string; retryAfter?: number } | null {
  if (error instanceof RateLimitError) {
    return {
      error: error.message,
      retryAfter: error.retryAfterSeconds,
    };
  }
  return null;
}

// ============================================
// THREAT DETECTION AND DDOS PROTECTION
// ============================================

export interface ThreatAnalysis {
  isThreat: boolean;
  isBlocked: boolean;
  threatScore: number;
  reasons: string[];
  shouldBlock: boolean;
}

/**
 * Analyze a request for potential threats.
 * Returns threat analysis with score and recommendations.
 */
export function analyzeRequest(
  ip: string,
  path: string,
  userAgent: string | null
): ThreatAnalysis {
  const reasons: string[] = [];
  let threatScore = 0;

  // Check if IP is already blocked
  if (blockedIPs.has(ip)) {
    return {
      isThreat: true,
      isBlocked: true,
      threatScore: 100,
      reasons: ["IP is blocked"],
      shouldBlock: true,
    };
  }

  // Check for suspicious paths
  for (const pattern of SUSPICIOUS_PATHS) {
    if (pattern.test(path)) {
      threatScore += 25;
      reasons.push(`Suspicious path pattern: ${pattern.source}`);
      break; // Only count once
    }
  }

  // Check for suspicious user agents
  if (userAgent) {
    for (const pattern of SUSPICIOUS_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        threatScore += 20;
        reasons.push(`Suspicious user agent: ${pattern.source}`);
        break;
      }
    }
    // Empty or very short user agent
    if (userAgent.length < 10) {
      threatScore += 10;
      reasons.push("Suspicious short user agent");
    }
  } else {
    threatScore += 15;
    reasons.push("Missing user agent");
  }

  // Check threat history
  const threatEntry = threatStore.get(ip);
  if (threatEntry) {
    threatScore += threatEntry.score * 0.5; // Add 50% of historical score
    if (threatEntry.violations.length > 5) {
      threatScore += 20;
      reasons.push("Multiple previous violations");
    }
  }

  // Determine if this is a threat
  const isThreat = threatScore >= 20;
  const shouldBlock = threatScore >= 50;

  return {
    isThreat,
    isBlocked: false,
    threatScore,
    reasons,
    shouldBlock,
  };
}

/**
 * Record a threat event for an IP.
 * Automatically blocks IPs that exceed the threshold.
 */
export function recordThreat(
  ip: string,
  reason: string,
  score: number = 10
): void {
  const now = Date.now();
  const existing = threatStore.get(ip);

  if (existing) {
    existing.score += score;
    existing.lastSeen = now;
    existing.violations.push(reason);

    // Keep only last 20 violations
    if (existing.violations.length > 20) {
      existing.violations = existing.violations.slice(-20);
    }

    // Auto-block if score exceeds threshold
    if (existing.score >= 100 && !existing.blocked) {
      existing.blocked = true;
      existing.blockedUntil = now + 3600000; // Block for 1 hour
      blockedIPs.add(ip);
      console.warn(`[SECURITY] Auto-blocked IP: ${ip}, score: ${existing.score}`);
    }

    threatStore.set(ip, existing);
  } else {
    threatStore.set(ip, {
      score,
      lastSeen: now,
      blocked: false,
      blockedUntil: 0,
      violations: [reason],
    });
  }
}

/**
 * Manually block an IP address.
 */
export function blockIP(ip: string, durationMs: number = 3600000): void {
  const now = Date.now();
  blockedIPs.add(ip);

  const existing = threatStore.get(ip);
  if (existing) {
    existing.blocked = true;
    existing.blockedUntil = now + durationMs;
  } else {
    threatStore.set(ip, {
      score: 100,
      lastSeen: now,
      blocked: true,
      blockedUntil: now + durationMs,
      violations: ["Manual block"],
    });
  }

  console.warn(`[SECURITY] Manually blocked IP: ${ip} for ${durationMs}ms`);
}

/**
 * Unblock an IP address.
 */
export function unblockIP(ip: string): void {
  blockedIPs.delete(ip);
  const entry = threatStore.get(ip);
  if (entry) {
    entry.blocked = false;
    entry.score = 0;
    entry.violations = [];
  }
  console.info(`[SECURITY] Unblocked IP: ${ip}`);
}

/**
 * Check if an IP is blocked.
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

/**
 * Get current security stats.
 */
export function getSecurityStats(): {
  blockedIPs: number;
  trackedThreats: number;
  rateLimitEntries: number;
} {
  return {
    blockedIPs: blockedIPs.size,
    trackedThreats: threatStore.size,
    rateLimitEntries: rateLimitStore.size,
  };
}

/**
 * DDoS protection rate limiter.
 * More aggressive than standard rate limiting.
 */
export const DDoSLimiter = {
  /** Global requests: 1000 per minute per IP */
  global: {
    limit: 1000,
    windowSeconds: 60,
    prefix: "ddos-global",
  } as RateLimitConfig,

  /** Burst protection: 50 requests per second per IP */
  burst: {
    limit: 50,
    windowSeconds: 1,
    prefix: "ddos-burst",
  } as RateLimitConfig,

  /** API endpoint protection: 100 per minute per IP */
  api: {
    limit: 100,
    windowSeconds: 60,
    prefix: "ddos-api",
  } as RateLimitConfig,
};

/**
 * Check for DDoS-like behavior.
 * Returns true if the request should be blocked.
 */
export function checkDDoS(ip: string): { blocked: boolean; reason?: string } {
  // Check burst limit first (most aggressive)
  const burstResult = checkRateLimit(ip, DDoSLimiter.burst);
  if (!burstResult.success) {
    recordThreat(ip, "Burst rate limit exceeded", 30);
    return { blocked: true, reason: "Rate limit exceeded (burst)" };
  }

  // Check global limit
  const globalResult = checkRateLimit(ip, DDoSLimiter.global);
  if (!globalResult.success) {
    recordThreat(ip, "Global rate limit exceeded", 20);
    return { blocked: true, reason: "Rate limit exceeded (global)" };
  }

  return { blocked: false };
}
