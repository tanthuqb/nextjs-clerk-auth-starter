'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

const inputClassName =
  'w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'

export default function OnboardingPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true)
    setError(null)
    const res = await completeOnboarding(formData)
    if (res?.message) {
      // Forces a token refresh so the new `onboardingComplete` claim is picked up by the proxy
      await user?.reload()
      router.push('/')
      return
    }
    if (res?.error) {
      setError(res.error)
    }
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Welcome</h1>
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="applicationName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Application Name
            </label>
            <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">Enter the name of your application.</p>
            <input id="applicationName" type="text" name="applicationName" required maxLength={200} className={inputClassName} />
          </div>

          <div>
            <label htmlFor="applicationType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Application Type
            </label>
            <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">Describe the type of your application.</p>
            <input id="applicationType" type="text" name="applicationType" required maxLength={200} className={inputClassName} />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              Error: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
