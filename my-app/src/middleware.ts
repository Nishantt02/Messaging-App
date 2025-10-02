import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {

  // here we the token
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or verify page then redirectd it
  if (
    token &&  // if token exsit
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) 
  {
    // redirect it to the dashborad.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // if token not exist then redirected it to the sign-in page
  if (!token && url.pathname.startsWith('/dashboard')) 
    {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}