import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest , NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

const isOnboardingRoute = createRouteMatcher(['/onboarding'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
   const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth()

  // Redirect root path to sign-up page if not authenticated
  if(req.nextUrl.pathname === '/' && !isAuthenticated) {
    const signUpUrl = new URL('/sign-up', req.url)
    return NextResponse.redirect(signUpUrl)
  }

  // For users visiting /dashboard, don't try to redirect
  if(isOnboardingRoute(req) && isAuthenticated) {
    return NextResponse.next()
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if(isOnboardingRoute(req) && !isAuthenticated) {
    return redirectToSignIn({
      returnBackUrl: req.url,
    })
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboarding route to complete the onboarding
  if(isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    const onOnboarding = new URL('/onboarding', req.url)
    return NextResponse.redirect(onOnboarding)
  }

   // If the user is logged in and the route is protected, let them view.
   if(isPublicRoute(req) && isAuthenticated) {
    return NextResponse.next()
   }

   // Redirect any unknown/invalid routes to sign-up page
   if(!isPublicRoute(req) && !isOnboardingRoute(req) && !isAuthenticated) {
    const signUpUrl = new URL('/sign-up', req.url)
    return NextResponse.redirect(signUpUrl)
   }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}