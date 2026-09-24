'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

function readText(formData: FormData, name: string, maxLength = 200): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export const completeOnboarding = async (formData: FormData) => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    return { error: 'No logged in user' }
  }

  const applicationName = readText(formData, 'applicationName')
  const applicationType = readText(formData, 'applicationType')

  if (!applicationName || !applicationType) {
    return { error: 'Application name and type are required.' }
  }

  const client = await clerkClient()

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        applicationName,
        applicationType,
      },
    })
    return { message: 'Onboarding complete' }
  } catch (error) {
    console.error('Failed to update user metadata', error)
    return { error: 'There was an error updating the user metadata.' }
  }
}
