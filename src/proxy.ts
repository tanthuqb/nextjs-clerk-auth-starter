import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Next.js 16 renamed `middleware.ts` to `proxy.ts`. Clerk's `clerkMiddleware()` is
// still required and is exported as the default proxy function.
//
// Security note: the redirects below are a UX convenience only. Every protected
// page, layout and Server Action performs its own auth check (resource-based
// protection, as recommended by Clerk since `createRouteMatcher()` was deprecated).

function matchesSegment(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

const PUBLIC_PREFIXES = ['/sign-in', '/sign-up']
const SIGN_IN_REQUIRED_PREFIXES = ['/onboarding', '/profile']

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (PUBLIC_PREFIXES.some((prefix) => matchesSegment(pathname, prefix))) {
    return NextResponse.next()
  }

  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth()

  if (!isAuthenticated) {
    if (SIGN_IN_REQUIRED_PREFIXES.some((prefix) => matchesSegment(pathname, prefix))) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    // `/` and any other route: send new visitors to sign-up.
    return NextResponse.redirect(new URL('/sign-up', req.url))
  }

  // Signed-in users can always reach the onboarding flow.
  if (matchesSegment(pathname, '/onboarding')) {
    return NextResponse.next()
  }

  // Users without `onboardingComplete: true` in their public metadata must finish
  // onboarding first. Requires the session token customization described in the README.
  if (!sessionClaims?.metadata?.onboardingComplete) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
