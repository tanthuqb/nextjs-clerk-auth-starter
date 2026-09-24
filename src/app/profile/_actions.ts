'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, type Profile, type ProfileUpdate } from '../../lib/supabase'

const MAX_LENGTHS = {
  full_name: 200,
  phone: 50,
  address: 500,
  bio: 2000,
} as const

function readField(formData: FormData, name: keyof typeof MAX_LENGTHS): string | null {
  const value = formData.get(name)
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, MAX_LENGTHS[name])
}

export async function getProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const { userId } = await auth()

  if (!userId) {
    return { data: null, error: 'Unauthorized' }
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function createOrUpdateProfile(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  // The avatar always comes from Clerk on the server, never from client input.
  const user = await currentUser()

  const profileData: ProfileUpdate = {
    full_name: readField(formData, 'full_name'),
    bio: readField(formData, 'bio'),
    phone: readField(formData, 'phone'),
    address: readField(formData, 'address'),
    avatar_url: user?.imageUrl ?? null,
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('profiles')
    .upsert({ clerk_user_id: userId, ...profileData }, { onConflict: 'clerk_user_id' })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  return { success: true, error: null }
}

export async function deleteProfile(): Promise<{ success: boolean; error: string | null }> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('clerk_user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  return { success: true, error: null }
}
