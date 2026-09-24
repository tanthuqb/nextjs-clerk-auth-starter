import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Resource-based protection for /profile (does not rely on proxy.ts path matching).
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth()

  if (!isAuthenticated) {
    return redirectToSignIn()
  }

  if (!sessionClaims?.metadata?.onboardingComplete) {
    redirect('/onboarding')
  }

  return <>{children}</>
}
