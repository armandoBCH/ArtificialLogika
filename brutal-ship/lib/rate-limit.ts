/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with automatic cleanup.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetIn: number; // ms until reset
}

/**
 * Check rate limit for a given identifier (usually IP).
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): RateLimitResult {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetAt) {
        store.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    entry.count++;

    if (entry.count > maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetIn: entry.resetAt - now,
        };
    }

    return {
        success: true,
        remaining: maxRequests - entry.count,
        resetIn: entry.resetAt - now,
    };
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
    return (
        (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()) ??
        request.headers.get("x-real-ip") ??
        request.headers.get("cf-connecting-ip") ??
        "unknown"
    );
}
