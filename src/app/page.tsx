import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl bg-white p-12 shadow-lg dark:bg-zinc-900">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            🚀 Next.js + Clerk Auth Starter
          </h1>
          {userId && <UserButton afterSignOutUrl="/sign-up" />}
        </div>
        
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to your authenticated dashboard!
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            You are successfully signed in. This starter includes:
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white">🔐 Authentication</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign up, sign in with Clerk
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white">📝 Onboarding</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Custom onboarding flow
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white">🛡️ Middleware</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Route protection built-in
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-white">🌙 Dark Mode</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tailwind dark mode support
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="https://clerk.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Clerk Docs
          </a>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 px-6 py-2 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            Next.js Docs
          </a>
        </div>
      </main>
    </div>
  );
}
