/**
 * Custom Domain Configuration for DexAppBuilder
 * Handles security configurations for external domains
 */

export interface CustomDomainConfig {
  domain: string;
  isVerified: boolean;
  securityLevel: 'strict' | 'moderate' | 'permissive';
  allowedOrigins: string[];
  cspConfig: CSPConfig;
}

export interface CSPConfig {
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
}

export const defaultCustomDomainCSP: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://va.vercel-scripts.com',
    'https://vercel.live',
    'https://vercel.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com',
    'data:'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:',
    'https://i.seadn.io',
    'https://dweb.link',
    'https://ipfs.io',
    'https://ipfs.moralis.io',
    'https://dashboard.mypinata.cloud',
    'https://raw.githubusercontent.com',
    'https://arpeggi.io',
    'https://arweave.net',
    'https://i.ibb.co',
    'https://assets.otherside.xyz',
    'https://dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
    'https://dexkit-storage.nyc3.digitaloceanspaces.com',
    'https://dexkit-test.nyc3.digitaloceanspaces.com'
  ],
  'connect-src': [
    "'self'",
    'https:',
    'wss:',
    'https://api.dexkit.com',
    'https://*.dexkit.app',
    'https://*.dexkit.com',
    'https://vercel.live',
    'https://vercel.com',
    'https://c.thirdweb.com',
    'https://*.rpc.thirdweb.com'
  ],
  'frame-src': [
    "'self'",
    'https://vercel.live',
    'https://vercel.com'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'upgrade-insecure-requests': []
};

export function generateCustomDomainCSP(domain: string): string {
  const csp = defaultCustomDomainCSP;

  const domainSources = [
    `https://${domain}`,
    `https://*.${domain.split('.').slice(-2).join('.')}` // Allow subdomains
  ];

  csp['connect-src'] = [...csp['connect-src'], ...domainSources];

  csp['img-src'] = [...csp['img-src'], ...domainSources];

  return Object.entries(csp)
    .map(([directive, sources]) => {
      if (Array.isArray(sources)) {
        return `${directive} ${sources.join(' ')}`;
      }
      return `${directive} ${sources}`;
    })
    .join('; ');
}

export function validateCustomDomain(domain: string): { isValid: boolean; reason?: string } {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!domainRegex.test(domain)) {
    return { isValid: false, reason: 'Invalid domain format' };
  }

  const dangerousPatterns = [
    /^localhost$/,
    /^127\.0\.0\.1$/,
    /^0\.0\.0\.0$/,
    /^192\.168\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(domain)) {
      return { isValid: false, reason: 'Domain not allowed for security reasons' };
    }
  }

  return { isValid: true };
}

export function getSecurityLevel(domain: string): 'strict' | 'moderate' | 'permissive' {
  if (domain.endsWith('.com') || domain.endsWith('.org') || domain.endsWith('.net')) {
    return 'strict';
  }

  if (domain.endsWith('.xyz') || domain.endsWith('.io') || domain.endsWith('.app')) {
    return 'moderate';
  }

  return 'permissive';
}
