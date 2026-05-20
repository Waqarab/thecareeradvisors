import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Get the Authorization header from the request
  const basicAuth = req.headers.get('authorization');

  // 2. If the header exists, decode the base64 string
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // 3. Check against your secure environment variables
    if (
      user === process.env.STAGING_USER && 
      pwd === process.env.STAGING_PASSWORD
    ) {
      // If correct, let them into the site
      return NextResponse.next();
    }
  }

  // 4. If no header exists, or password is wrong, block them
  // This triggers the browser's native login popup
  return new NextResponse('Unauthorized Access - Site Under Construction', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// 5. Apply this lock to EVERY single page and asset
export const config = {
  matcher: '/:path*', 
};