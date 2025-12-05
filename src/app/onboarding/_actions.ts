"use server"
import { auth, clerkClient } from '@clerk/nextjs/server'
import { on } from 'events'

export const completeOnboarding = async (formData: FormData) => {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated) {
        return { message: 'No Logged In User' }
    }

    const client = await clerkClient()

    try {
        const res = await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                onboardingComplete: true,
                applicationName: formData.get('applicationName'),
                applicationType: formData.get('applicationType'),
            },
        })
        return { message: 'Onboarding Complete' }
    } catch (error) {
        return { error: 'There was an error updating the user metadata.' }
    }
}