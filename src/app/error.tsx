'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-12 w-12 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-zinc-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          An unexpected error has occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
