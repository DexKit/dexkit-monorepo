/**
 * Security Configuration for Next.js
 * Centralized security settings for DexAppBuilder
 */

const securityConfig = {
  // Remove poweredByHeader for security
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Security headers function for Next.js
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy - Temporarily simplified for compatibility
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live https://vercel.com https://c.thirdweb.com https://*.rpc.thirdweb.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
              "img-src 'self' data: https: blob: https://i.seadn.io https://dweb.link https://ipfs.io https://ipfs.moralis.io https://dashboard.mypinata.cloud https://raw.githubusercontent.com https://arpeggi.io https://arweave.net https://i.ibb.co https://assets.otherside.xyz https://dexkit-storage.nyc3.cdn.digitaloceanspaces.com https://dexkit-storage.nyc3.digitaloceanspaces.com https://dexkit-test.nyc3.digitaloceanspaces.com",
              "connect-src 'self' https: wss: https://api.dexkit.com https://*.dexkit.app https://*.dexkit.com https://vercel.live https://vercel.com https://c.thirdweb.com https://*.rpc.thirdweb.com",
              "frame-src 'self' https://vercel.live https://vercel.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },

          // HTTP Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },

          // Cross-Origin Opener Policy
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },

          // Cross-Origin Embedder Policy
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },

          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },

          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },

          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=(self)'
          },

          // Additional security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          }
        ]
      }
    ];
  }
};

export default securityConfig;
