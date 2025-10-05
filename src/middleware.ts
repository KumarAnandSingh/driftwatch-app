import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes, static files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/verify')
  ) {
    return NextResponse.next();
  }

  // Check authentication
  const session = await auth();

  if (!session?.user?.email) {
    // Redirect unauthenticated users to sign-in
    if (!pathname.startsWith('/sign-in')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  // User is authenticated - check onboarding status
  // Skip onboarding check if already on onboarding page
  if (pathname.startsWith('/onboarding')) {
    return NextResponse.next();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        onboardingCompleted: true,
        emailVerified: true,
      },
    });

    // Redirect to onboarding if not completed and email is verified
    if (user && user.emailVerified && !user.onboardingCompleted) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  } catch (error) {
    console.error('Middleware error checking onboarding:', error);
    // Continue to requested page if check fails
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
