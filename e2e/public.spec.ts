import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

test.describe('unauthenticated visitor', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
  })

  test('visiting / redirects to sign-up', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/sign-up/)
  })

  test('sign-in page renders the Clerk <SignIn /> component', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page.locator('.cl-signIn-root')).toBeVisible()
    await expect(page.locator('input[name="identifier"]')).toBeVisible()
  })

  test('sign-up page renders the Clerk <SignUp /> component', async ({ page }) => {
    await page.goto('/sign-up')
    await expect(page.locator('.cl-signUp-root')).toBeVisible()
  })

  test('protected /profile redirects to sign-in', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/sign-in/)
    await expect(page.locator('.cl-signIn-root')).toBeVisible()
  })

  test('unknown routes redirect to sign-up for signed-out users', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page).toHaveURL(/\/sign-up/)
  })

  test('theme toggle switches and persists the theme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/sign-in')
    const html = page.locator('html')
    const toggle = page.getByTestId('theme-toggle')

    await expect(html).not.toHaveClass(/\bdark\b/)
    await toggle.click()
    await expect(html).toHaveClass(/\bdark\b/)

    // The choice survives a reload (stored in localStorage and applied before paint).
    await page.reload()
    await expect(html).toHaveClass(/\bdark\b/)

    await page.getByTestId('theme-toggle').click()
    await expect(html).not.toHaveClass(/\bdark\b/)
  })
})
