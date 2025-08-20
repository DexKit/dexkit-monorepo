/**
 * Server-side security utilities
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { generateSecurityHeaders } from './security';

export function applySecurityHeaders(res: NextApiResponse) {
  const headers = generateSecurityHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
}

export function validateOrigin(req: NextApiRequest, allowedOrigins: string[]): boolean {
  const origin = req.headers.origin;
  if (!origin) return false;

  return allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const domain = allowed.replace('*', '');
      return origin.endsWith(domain);
    }
    return origin === allowed;
  });
}

export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requestData = this.requests.get(identifier);

    if (!requestData || now > requestData.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (requestData.count >= this.maxRequests) {
      return false;
    }

    requestData.count++;
    return true;
  }

  getRemaining(identifier: string): number {
    const requestData = this.requests.get(identifier);
    if (!requestData) return this.maxRequests;

    const now = Date.now();
    if (now > requestData.resetTime) return this.maxRequests;

    return Math.max(0, this.maxRequests - requestData.count);
  }
}

export function securityMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  applySecurityHeaders(res);

  const allowedOrigins = [
    'https://dexkit.com',
    'https://*.dexkit.app',
    'https://*.dexkit.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  if (!validateOrigin(req, allowedOrigins)) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  if (req.body) {
    req.body = sanitizeInput(req.body);
  }

  if (req.query) {
    req.query = sanitizeInput(req.query);
  }

  next();
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}
