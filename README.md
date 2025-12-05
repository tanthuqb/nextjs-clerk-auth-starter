# 🚀 Next.js Clerk Authentication Starter

A production-ready authentication starter kit built with **Next.js 15**, **Clerk**, **Supabase**, and **Tailwind CSS**.  
Complete with user authentication flows, protected routes, profile management, theme switching, and a clean modern UI.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://nextjs-clerk-auth-starter.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source-black?style=for-the-badge&logo=github)](https://github.com/tanthuqb/nextjs-clerk-auth-starter)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## 📸 Screenshots

| Sign Up | Dashboard | Profile (Dark Mode) |
|---------|-----------|---------------------|
| ![Sign Up](./screenshots/signup.png) | ![Dashboard](./screenshots/dashboard.png) | ![Profile](./screenshots/profile-dark.png) |

---

## ✨ Features

### 🔐 Authentication (Clerk)
- Sign up / Sign in with email or OAuth
- Session management & persistence
- Protected routes using middleware
- Automatic redirect for unauthenticated users

### 👤 User Profile
- Update profile information (name, phone, address, bio)
- Avatar synced from Clerk
- Profile data stored in Supabase

### 🛡️ Route Protection
- Middleware-based route protection
- Layout guards for dashboard
- Automatic redirect to sign-up

### 🎨 UI/UX
- Dark / Light theme support
- Responsive mobile-first design
- Clean and modern interface
- Accessible components

### 🗂️ Database Integration
- Supabase PostgreSQL connection
- Row Level Security (RLS) enabled
- Auto-generated timestamps

### 🧱 Code Structure
- Next.js 15 App Router
- Server Actions for mutations
- Modular component architecture
- Type-safe with TypeScript

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Supabase](https://supabase.com/) | PostgreSQL database & API |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home/Dashboard
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading UI
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404 page
│   ├── global-error.tsx      # Global error handler
│   ├── globals.css           # Global styles
│   ├── onboarding/           # Onboarding flow
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── _actions.ts
│   ├── profile/              # Profile management
│   │   ├── page.tsx
│   │   └── _actions.ts
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx
│   └── sign-up/
│       └── [[...sign-up]]/
│           └── page.tsx
├── lib/
│   └── supabase.ts           # Supabase client
├── middleware.ts             # Auth middleware
└── components/               # Reusable components

supabase/
└── migrations/
    └── 001_create_profiles_table.sql
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- [Clerk Account](https://clerk.com/)
- [Supabase Account](https://supabase.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/tanthuqb/nextjs-clerk-auth-starter.git

# Navigate to project
cd nextjs-clerk-auth-starter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

> 📌 Get Clerk keys: [Clerk Dashboard](https://dashboard.clerk.com/)  
> 📌 Get Supabase keys: [Supabase Dashboard](https://supabase.com/dashboard)

---

## 🗄️ Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);
```

---

## 🔒 Authentication Flow

```
User visits / 
    ↓
Authenticated? 
    ├── No → Redirect to /sign-up
    └── Yes → Onboarding complete?
                  ├── No → Redirect to /onboarding
                  └── Yes → Show Dashboard
                              ↓
                        Can access /profile
```

---

## 🎯 Use Cases

This starter is perfect for:

- 🏢 **SaaS Applications** - Multi-tenant apps with user management
- 📊 **Admin Dashboards** - Protected admin interfaces
- 🛒 **E-commerce** - Customer accounts and profiles
- 📱 **Web Apps** - Any app requiring user authentication

---

## 🚀 Deploy

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tanthuqb/nextjs-clerk-auth-starter&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this starter for your projects!

---

## 👨‍💻 Author

**tanthuqb**

- GitHub: [@tanthuqb](https://github.com/tanthuqb)
- Demo: [nextjs-clerk-auth-starter.vercel.app](https://nextjs-clerk-auth-starter.vercel.app)

---

<p align="center">
  Made with ❤️ using Next.js, Clerk & Supabase
</p>
