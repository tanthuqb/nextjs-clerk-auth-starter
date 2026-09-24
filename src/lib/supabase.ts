import { auth } from '@clerk/nextjs/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Resolve the Supabase public API key.
 *
 * Supabase now issues publishable keys (`sb_publishable_...`) that replace the
 * legacy `anon` JWT key. Prefer the new variable and fall back to the legacy one
 * so existing deployments keep working.
 */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or the legacy NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    )
  }

  return { url, key }
}

/**
 * Whether Supabase requests should carry the Clerk session token.
 *
 * Enable this (SUPABASE_CLERK_AUTH=true) only after Clerk has been added as a
 * third-party auth provider in Supabase and the RLS migration
 * `supabase/migrations/002_clerk_rls_policies.sql` has been applied.
 */
export function isClerkSupabaseAuthEnabled() {
  return process.env.SUPABASE_CLERK_AUTH === 'true'
}

/**
 * Create a Supabase client for use in Server Components and Server Actions.
 *
 * A new client is created per request so the Clerk session token of the
 * current user is attached (when enabled) and RLS policies based on
 * `auth.jwt()->>'sub'` can scope rows to that user.
 */
export function createServerSupabaseClient(): SupabaseClient {
  const { url, key } = getSupabaseConfig()

  if (!isClerkSupabaseAuthEnabled()) {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  return createClient(url, key, {
    async accessToken() {
      return (await auth()).getToken()
    },
  })
}

// Types for profile
export interface Profile {
  id: string
  clerk_user_id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'clerk_user_id' | 'created_at' | 'updated_at'>>
