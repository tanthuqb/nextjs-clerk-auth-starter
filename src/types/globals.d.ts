export {}

declare global {
  interface CustomJwtSessionClaims {
    // Populated by the Clerk session token customization:
    // { "metadata": "{{user.public_metadata}}" }
    metadata?: {
      onboardingComplete?: boolean
    }
  }
}
