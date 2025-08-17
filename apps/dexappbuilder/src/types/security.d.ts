/**
 * Security-related TypeScript type definitions
 */

export interface SecurityConfig {
  csp: ContentSecurityPolicy;
  hsts: HTTPStrictTransportSecurity;
  coop: string;
  coep: string;
  xfo: string;
  referrerPolicy: string;
  permissionsPolicy: PermissionsPolicy;
}

export interface ContentSecurityPolicy {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'font-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'frame-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'upgrade-insecure-requests': string[];
  'require-trusted-types-for': string[];
  'trusted-types': string[];
}

export interface HTTPStrictTransportSecurity {
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface PermissionsPolicy {
  [key: string]: string[];
}

export interface SecurityHeaders {
  [key: string]: string;
}

export interface SecurityContextType {
  isSecure: boolean;
  trustedTypesSupported: boolean;
}

export interface SecurityViolationEvent {
  documentURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  blockedURI?: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface TrustedTypesPolicy {
  createHTML: (input: string) => string;
  createScript: (input: string) => string;
  createScriptURL: (input: string) => string;
}

export interface SecurityMiddlewareOptions {
  maxRequests?: number;
  windowMs?: number;
  allowedOrigins?: string[];
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableCOOP?: boolean;
  enableCOEP?: boolean;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string;
}

export interface SecurityReport {
  passed: number;
  failed: number;
  warnings: number;
  details: SecurityReportDetail[];
}

export interface SecurityReportDetail {
  url: string;
  status: 'PASSED' | 'FAILED';
  foundHeaders: number;
  missingHeaders: number;
  warnings: number;
}

declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (
        name: string,
        policy: TrustedTypesPolicy
      ) => TrustedTypesPolicy;
    };
    securityPolicyViolationEvent?: SecurityViolationEvent;
  }

  interface Document {
    domain?: string;
  }

  interface Navigator {
    crossOriginIsolated?: boolean;
  }
}
