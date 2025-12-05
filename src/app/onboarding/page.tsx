'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

export default function OnboardingPage() {
    const [error, setError] = React.useState<string | null>(null);
    const { user } = useUser();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const res = await completeOnboarding(formData)
        if (res?.message) {
            // Forces a token refresh and refreshes the `User` object
            await user?.reload()
            router.refresh()
        }
        if (res?.error) {
            setError(res.error)
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Welcome</h1>
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Application Name
                        </label>
                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Enter the name of your application.
                        </p>
                        <input 
                            type="text" 
                            name="applicationName" 
                            required 
                            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Application Type
                        </label>
                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Describe the type of your application.
                        </p>
                        <input 
                            type="text" 
                            name="applicationType" 
                            required 
                            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">Error: {error}</p>}
                    
                    <button 
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
