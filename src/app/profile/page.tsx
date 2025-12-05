'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createOrUpdateProfile, getProfile } from './_actions'
import { Profile } from '../../lib/supabase'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  React.useEffect(() => {
    async function loadProfile() {
      const { data, error } = await getProfile()
      if (data) {
        setProfile(data)
      }
      setLoading(false)
    }
    if (isLoaded && user) {
      loadProfile()
    }
  }, [isLoaded, user])

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    setMessage(null)
    
    const result = await createOrUpdateProfile(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Reload profile data
      const { data } = await getProfile()
      if (data) setProfile(data)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
    }
    
    setSaving(false)
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-4">
          {user?.imageUrl && (
            <img 
              src={user.imageUrl} 
              alt="Avatar" 
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Update Profile
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={profile?.full_name || user?.fullName || ''}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={profile?.phone || ''}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              defaultValue={profile?.address || ''}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ''}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Tell us about yourself"
            />
          </div>

          <input type="hidden" name="avatar_url" value={user?.imageUrl || ''} />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
