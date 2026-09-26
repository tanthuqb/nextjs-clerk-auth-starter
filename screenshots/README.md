# Screenshots

Images referenced by the main README, captured from the live deployment at 1280x800:

- `signup.png` - Sign up page (`/sign-up`)
- `dashboard.png` - Dashboard page (`/`, signed in and onboarded)
- `profile-dark.png` - Profile page (`/profile`) with the dark theme enabled via the theme toggle button

To refresh them, run the app (or use the deployed URL) and capture with Playwright, for example:

```bash
npx playwright screenshot --viewport-size=1280,800 https://nextjs-clerk-auth-starter.vercel.app/sign-up screenshots/signup.png
```

Pages behind sign-in need an authenticated browser session.
