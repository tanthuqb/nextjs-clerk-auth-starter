import fs from 'node:fs'
import path from 'node:path'
import { clerk, clerkSetup } from '@clerk/testing/playwright'
import { test as setup, expect } from '@playwright/test'
import { AUTH_FILE, E2E_PASSWORD, E2E_USERNAME, hasTestUser, MISSING_TEST_USER_MESSAGE } from './helpers'

// Setup must run serially: it fetches a Clerk Testing Token used by all other tests.
setup.describe.configure({ mode: 'serial' })

setup('configure Clerk testing token', async () => {
  await clerkSetup()
})

setup('sign in E2E test user and save auth state', async ({ page }) => {
  setup.skip(!hasTestUser, MISSING_TEST_USER_MESSAGE)

  // clerk.signIn() must be called on a page that loads Clerk and is not protected.
  await page.goto('/sign-in')
  await clerk.signIn({
    page,
    signInParams: { strategy: 'password', identifier: E2E_USERNAME, password: E2E_PASSWORD },
  })

  // Signed in: `/` either shows the dashboard or redirects to onboarding.
  await page.goto('/')
  await expect(page).toHaveURL(/\/(onboarding)?$/)

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true })
  await page.context().storageState({ path: AUTH_FILE })
})
