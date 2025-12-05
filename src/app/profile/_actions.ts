'use server'

import { auth } from '@clerk/nextjs/server'
import { supabase, Profile, ProfileUpdate } from '../../lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const { userId } = await auth()
  
  if (!userId) {
    return { data: null, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function createOrUpdateProfile(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const { userId } = await auth()
  
  if (!userId) {
    return { success: false, error: 'Unauthorized' }
  }

  const profileData: ProfileUpdate = {
    full_name: formData.get('full_name') as string || null,
    bio: formData.get('bio') as string || null,
    phone: formData.get('phone') as string || null,
    address: formData.get('address') as string || null,
    avatar_url: formData.get('avatar_url') as string || null,
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  let error

  if (existingProfile) {
    // Update existing profile
    const result = await supabase
      .from('profiles')
      .update(profileData)
      .eq('clerk_user_id', userId)
    error = result.error
  } else {
    // Create new profile
    const result = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: userId,
        ...profileData
      })
    error = result.error
  }

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
