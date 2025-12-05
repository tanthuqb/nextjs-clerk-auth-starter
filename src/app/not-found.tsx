import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-zinc-200 dark:text-zinc-800">404</h1>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go Home
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
