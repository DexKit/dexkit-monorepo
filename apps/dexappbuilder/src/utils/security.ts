import securityConfig from '../../security.config.js';

export function generateSecurityHeaders() {
  const headers: Record<string, string> = {};

  const cspDirectives = Object.entries(securityConfig.csp)
    .map(([directive, sources]) => {
      if (Array.isArray(sources)) {
        return `${directive} ${sources.join(' ')}`;
      }
      return `${directive} ${sources}`;
    })
    .join('; ');

  headers['Content-Security-Policy'] = cspDirectives;

  const hsts = securityConfig.hsts;
  const hstsValue = [
    `max-age=${hsts.maxAge}`,
    hsts.includeSubDomains && 'includeSubDomains',
    hsts.preload && 'preload'
  ].filter(Boolean).join('; ');

  headers['Strict-Transport-Security'] = hstsValue;

  headers['Cross-Origin-Opener-Policy'] = securityConfig.coop;

  headers['Cross-Origin-Embedder-Policy'] = securityConfig.coep;

  headers['X-Frame-Options'] = securityConfig.xfo;

  headers['Referrer-Policy'] = securityConfig.referrerPolicy;

  const permissionsPolicy = Object.entries(securityConfig.permissionsPolicy)
    .map(([feature, origins]) => {
      if (Array.isArray(origins)) {
        return `${feature}=${origins.join(', ')}`;
      }
      return `${feature}=${origins}`;
    })
    .join(', ');

  headers['Permissions-Policy'] = permissionsPolicy;

  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-DNS-Prefetch-Control'] = 'off';
  headers['X-Download-Options'] = 'noopen';
  headers['X-Permitted-Cross-Domain-Policies'] = 'none';

  return headers;
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function validateCSPSource(source: string): boolean {
  const validPatterns = [
    /^'self'$/,
    /^'unsafe-inline'$/,
    /^'unsafe-eval'$/,
    /^'none'$/,
    /^data:$/,
    /^blob:$/,
    /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /^wss:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  ];

  return validPatterns.some(pattern => pattern.test(source));
}

export function createTrustedTypesPolicy() {
  if (typeof window !== 'undefined' && 'trustedTypes' in window) {
    const trustedTypes = (window as any).trustedTypes;

    trustedTypes.createPolicy('mui-theme', {
      createHTML: (string: string) => string,
      createScript: (string: string) => string,
      createScriptURL: (string: string) => string
    });


    trustedTypes.createPolicy('dynamic-content', {
      createHTML: (string: string) => string,
      createScript: (string: string) => string,
      createScriptURL: (string: string) => string
    });


    trustedTypes.createPolicy('nextjs#bundler', {
      createHTML: (string: string) => string,
      createScript: (string: string) => string,
      createScriptURL: (string: string) => string
    });
  }
}
