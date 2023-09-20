import { NextRequest, NextResponse } from 'next/server';

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
    '/u/:path*',
    '/admin/:path*',
    '/drop/:path*',
    '/contract/:path*'
  ],
};

const basePaths = [
  '/asset',
  '/collection',
  '/order',
  '/swap',
  '/test',
  '/forms',
  '/collections',
  '/wallet',
  '/404',
  '/admin',
  '/contract-wizard',
  '/u',
  '/drop',
  '/contract'
];

function isBasePath(path: string) {
  let isPath = false;
  // handle special case of index
  if (path === '/') {
    return true;
  }

  for (const p of basePaths) {
    isPath = isPath || path.startsWith(p);
  }
  return isPath;
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  let hostname = req.headers.get('host') || 'marketplace.localhost';

  hostname = hostname.replace(':3001', '');

  if (url.pathname.startsWith('/super-admin')) {
    return NextResponse.rewrite(url);
  }

  if (url.pathname.startsWith('/site')) {
    return NextResponse.rewrite(url);
  }


  if (
    hostname === 'whitelabel-nft.dexkit.com' ||
    hostname === 'dexappbuilder.dexkit.com' ||
    hostname === 'dexappbuilder-dev.dexkit.com'
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

  if (isBasePath(url.pathname)) {
    // rewrite everything else to `/_sites/[site] dynamic route
    url.pathname = `/_site/${hostname}${url.pathname}`;

    return NextResponse.rewrite(url);
  } else {
    // is not on base path, let's go to custom pages
    url.pathname = `/_custom/${hostname}${url.pathname}`;

    return NextResponse.rewrite(url);
  }
}
