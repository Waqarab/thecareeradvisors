import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. THE BYPASS: If you are running this locally (npm run dev), skip the lock completely!
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // 2. THE LOCK: This will ONLY run when deployed to Vercel
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (
      user === process.env.STAGING_USER && 
      pwd === process.env.STAGING_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Unauthorized Access - Site Under Construction', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: '/:path*', 
};