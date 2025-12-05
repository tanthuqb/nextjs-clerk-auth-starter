import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
