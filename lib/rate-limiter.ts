type RateLimitOptions = {
  windowMs: number;
  max: number;
};

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private max: number;

  constructor(options: RateLimitOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = this.requests.get(identifier) || [];
    // Remove old timestamps
    const recent = timestamps.filter(ts => ts > windowStart);
    recent.push(now);
    this.requests.set(identifier, recent);
    return recent.length <= this.max;
  }

  getRemaining(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = this.requests.get(identifier) || [];
    const recent = timestamps.filter(ts => ts > windowStart);
    return Math.max(0, this.max - recent.length);
  }
} 