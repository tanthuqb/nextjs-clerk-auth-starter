import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'
import { AUTH_FILE, hasTestUser, MISSING_TEST_USER_MESSAGE } from './helpers'

test.skip(!hasTestUser, MISSING_TEST_USER_MESSAGE)

test.use({ storageState: AUTH_FILE })

// These tests share one Clerk user, so run them in order.
test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page })
})

test('onboarding: new users complete onboarding, finished users are sent to the dashboard', async ({ page }) => {
  await page.goto('/')

  if (/\/onboarding$/.test(new URL(page.url()).pathname)) {
    await page.getByLabel('Application Name').fill('E2E App')
    await page.getByLabel('Application Type').fill('Playwright test')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page).toHaveURL(/\/$/)
  }

  // Once onboarding is complete, /onboarding redirects back to the dashboard.
  await page.goto('/onboarding')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByText('Welcome to your authenticated dashboard!')).toBeVisible()
})

test('dashboard shows the user menu and profile link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Next\.js \+ Clerk Auth Starter/ })).toBeVisible()
  await expect(page.getByText('Welcome to your authenticated dashboard!')).toBeVisible()
  await expect(page.locator('.cl-userButtonTrigger')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Edit Profile' })).toBeVisible()
})

test('profile: edit and save persists to Supabase', async ({ page }) => {
  const stamp = Date.now().toString()
  const values = {
    fullName: `E2E User ${stamp}`,
    phone: `+1555${stamp.slice(-7)}`,
    address: `${stamp} Test Street`,
    bio: `Bio written by Playwright at ${stamp}`,
  }

  await page.goto('/')
  await page.getByRole('link', { name: 'Edit Profile' }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByRole('heading', { name: 'Update Profile' })).toBeVisible()
  await expect(page.getByAltText('Avatar')).toBeVisible()

  await page.getByLabel('Full Name').fill(values.fullName)
  await page.getByLabel('Phone').fill(values.phone)
  await page.getByLabel('Address').fill(values.address)
  await page.getByLabel('Bio').fill(values.bio)
  await page.getByRole('button', { name: 'Save Profile' }).click()

  await expect(page.getByRole('status')).toHaveText('Profile updated successfully!')

  // Reload and confirm the values were read back from Supabase.
  await page.reload()
  await expect(page.getByLabel('Full Name')).toHaveValue(values.fullName)
  await expect(page.getByLabel('Phone')).toHaveValue(values.phone)
  await expect(page.getByLabel('Address')).toHaveValue(values.address)
  await expect(page.getByLabel('Bio')).toHaveValue(values.bio)
})

test('theme toggle works on the dashboard', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const html = page.locator('html')

  await expect(html).not.toHaveClass(/\bdark\b/)
  await page.getByTestId('theme-toggle').click()
  await expect(html).toHaveClass(/\bdark\b/)
  await page.getByTestId('theme-toggle').click()
  await expect(html).not.toHaveClass(/\bdark\b/)
})

test('404 page is shown for unknown routes', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible()
})
