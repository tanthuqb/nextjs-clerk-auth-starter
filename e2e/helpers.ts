import path from 'node:path'

/** Where the signed-in browser state of the E2E test user is stored. */
export const AUTH_FILE = path.join(__dirname, '..', 'playwright', '.clerk', 'user.json')

export const E2E_USERNAME = process.env.E2E_CLERK_USER_USERNAME ?? ''
export const E2E_PASSWORD = process.env.E2E_CLERK_USER_PASSWORD ?? ''

export const hasTestUser = Boolean(E2E_USERNAME && E2E_PASSWORD)

export const MISSING_TEST_USER_MESSAGE =
  'Skipped: set E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD (a Clerk test user with ' +
  'password sign-in, e.g. e2e+clerk_test@example.com) in .env.local to run authenticated E2E tests.'
