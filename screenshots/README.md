# Screenshots

The main README references these files, which have not been added yet:

- `signup.png` - Sign up page (`/sign-up`)
- `dashboard.png` - Dashboard page (`/`, signed in and onboarded)
- `profile-dark.png` - Profile page (`/profile`) with the dark theme enabled via the theme toggle button

Recommended size: 1280x720 or a similar 16:9 ratio.

Tip: you can capture them with Playwright while the dev server is running, for example
`npx playwright screenshot --viewport-size=1280,720 http://localhost:3000/sign-up screenshots/signup.png`.
Pages behind sign-in need an authenticated browser session.
