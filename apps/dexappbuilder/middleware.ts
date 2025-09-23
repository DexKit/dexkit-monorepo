import { NextRequest, NextResponse } from 'next/server';
import { generateCustomDomainCSP, validateCustomDomain } from './src/config/customDomains';

export const config = {
  matcher: [
    '/',
    '/([^/.]*)', // exclude `/public` files by matching all paths except for paths containing `.` (e.g. /logo.png)
    '/asset/:path*',
    '/order/:path*',
    '/collection/:path*',
    '/forms/:path*',
    '/contract-wizard/:path*',
    '/wallet/:path*',
    '/404/:path*',
    '/email-verified/:path*',
    '/u/:path*',
    '/c/:path*',
    '/admin/:path*',
    '/drop/:path*',
    '/checkout/:path*',
    '/contract/:path*',

    '/stake/:path*',
    '/token/:path*',
    '/airdrop/:path*',

    '/embed/:path*'
  ],
};

const basePaths = [
  '/asset',
  '/collection',
  '/order',
  '/swap',
  '/test',
  '/forms',
  '/checkout',
  '/collections',
  '/wallet',
  '/404',
  '/email-verified',
  '/admin',
  '/contract-wizard',
  '/u',
  '/c',
  '/drop',
  '/contract',
  '/stake',
  '/token',
  '/airdrop',
  '/embed'
];

function isBasePath(path: string) {
  let isPath = false;
  // handle special case of index
  if (path === '/') {
    return true;
  }

  for (const p of basePaths) {
    isPath = isPath || path === p || path.startsWith(`${p}/`);
  }
  return isPath;
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const securityHeaders = generateDynamicSecurityHeaders(req);

  let hostname = req.headers.get('host') || 'marketplace.localhost';
  hostname = hostname.replace(':3001', '');

  if (url.pathname.startsWith('/super-admin')) {
    return NextResponse.rewrite(url);
  }

  if (url.pathname.startsWith('/site')) {
    return NextResponse.rewrite(url);
  }

  if (url.pathname.startsWith('/_widget_iframe')) {
    return NextResponse.rewrite(url);
  }

  if (hostname === 'ploobit-swap.dexkit.app') {
    url.pathname = '/empty';
    return NextResponse.rewrite(url);
  }

  if (
    hostname === 'whitelabel-nft.dexkit.com' ||
    hostname === 'dexappbuilder.dexkit.com' ||
    hostname === 'dexappbuilder-dev.dexkit.com' ||
    hostname === 'dexappbuilder.com'
  ) {
    // we pass here the search param to be used on get config
    const search = url.searchParams.get('mid');
    if (search) {
      hostname = `${hostname}:${search}`;
    }
  }

  if (hostname === 'test.dev.dexkit.app') {
    // we pass here the search param to be used on get config
    const search = url.searchParams.get('mid');
    if (search) {
      hostname = `${hostname}:${search}`;
    }
  }

  if (hostname.endsWith('.dexkit.app')) {
    // we pass here the slug param to be used on get config
    let slug;
    if (process.env.IS_STAGING === 'true') {
      slug = hostname.split('.dev.dexkit.app')[0];
    } else {
      slug = hostname.split('.dexkit.app')[0];
    }

    if (slug) {
      hostname = `dexkit.app:${slug}`;
    }
  }

  if (isCustomExternalDomain(hostname)) {
    console.log(`Custom external domain detected: ${hostname}`);
  }

  // only for testing
  /*if (hostname.startsWith('localhost')) {
    hostname = `localhost:arbitrum`;
  }*/

  let response: NextResponse;

  if (isBasePath(url.pathname)) {
    // rewrite everything else to `/_sites/[site] dynamic route
    url.pathname = `/_site/${hostname}${url.pathname}`;
    response = NextResponse.rewrite(url);
  } else {
    // is not on base path, let's go to custom pages
    url.pathname = `/_custom/${hostname}${url.pathname}`;
    response = NextResponse.rewrite(url);
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

function isCustomExternalDomain(hostname: string): boolean {
  const cleanHostname = hostname.replace(/:\d+$/, '');

  const isInternalDomain =
    cleanHostname.endsWith('.dexkit.app') ||
    cleanHostname.endsWith('.dexkit.com') ||
    cleanHostname === 'localhost' ||
    cleanHostname === '127.0.0.1' ||
    cleanHostname === 'marketplace.localhost' ||
    cleanHostname === 'ploobit-swap.dexkit.app' ||
    cleanHostname === 'whitelabel-nft.dexkit.com' ||
    cleanHostname === 'dexappbuilder.dexkit.com' ||
    cleanHostname === 'dexappbuilder-dev.dexkit.com' ||
    cleanHostname === 'dexappbuilder.com' ||
    cleanHostname === 'test.dev.dexkit.app';

  return !isInternalDomain;
}

function generateDynamicSecurityHeaders(req: NextRequest) {
  const hostname = req.headers.get('host') || 'marketplace.localhost';
  const cleanHostname = hostname.replace(/:\d+$/, '');

  if (isCustomExternalDomain(cleanHostname)) {
    const validation = validateCustomDomain(cleanHostname);
    if (!validation.isValid) {
      console.warn(`Security warning: Invalid custom domain "${cleanHostname}": ${validation.reason}`);
      return {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self'",
          "font-src 'self'",
          "img-src 'self'",
          "connect-src 'self'",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'"
        ].join('; '),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=()',
        'X-Content-Type-Options': 'nosniff',
        'X-DNS-Prefetch-Control': 'off',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none'
      };
    }

    const csp = generateCustomDomainCSP(cleanHostname);

    return {
      'Content-Security-Policy': csp,
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=(self)',
      'X-Content-Type-Options': 'nosniff',
      'X-DNS-Prefetch-Control': 'off',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none'
    };
  }

  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live https://vercel.com",
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
    ].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(self), picture-in-picture=(self)',
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  };
}
