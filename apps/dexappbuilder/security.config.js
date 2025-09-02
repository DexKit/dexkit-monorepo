/**
 * Security Configuration for DexAppBuilder
 * Implements comprehensive security headers and CSP policies
 */

const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for MUI and dynamic content
      "'unsafe-eval'", // Required for some libraries
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vercel.live',
      'https://vercel.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for MUI and dynamic styles
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net',
      'https://unpkg.com'
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
      'https://vercel.com'
    ],
    'frame-src': [
      "'self'",
      'https://vercel.live',
      'https://vercel.com'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"], // Prevents clickjacking
    'upgrade-insecure-requests': [],
    // Temporarily disabled Trusted Types for Next.js compatibility
    // 'require-trusted-types-for': ["'script'"],
    // 'trusted-types': [
    //   'default',
    //   'mui-theme',
    //   'dynamic-content',
    //   'nextjs#bundler'
    // ]
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // Cross-Origin Opener Policy
  coop: 'same-origin',

  // Cross-Origin Embedder Policy
  coep: 'require-corp',

  // X-Frame-Options (fallback for older browsers)
  xfo: 'SAMEORIGIN',

  // Referrer Policy
  referrerPolicy: 'strict-origin-when-cross-origin',

  // Permissions Policy
  permissionsPolicy: {
    'camera': [],
    'microphone': [],
    'geolocation': [],
    'payment': [],
    'usb': [],
    'magnetometer': [],
    'gyroscope': [],
    'accelerometer': [],
    'ambient-light-sensor': [],
    'autoplay': [],
    'encrypted-media': [],
    'fullscreen': ["'self'"],
    'picture-in-picture': ["'self'"]
  }
};

export default securityConfig;
