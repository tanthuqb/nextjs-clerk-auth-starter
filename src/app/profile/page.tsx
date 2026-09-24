'use client'

import * as React from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createOrUpdateProfile, getProfile } from './_actions'
import type { Profile } from '../../lib/supabase'

const inputClassName =
  'mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'
const labelClassName = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300'

type Message = { type: 'success' | 'error'; text: string }

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [message, setMessage] = React.useState<Message | null>(null)

  React.useEffect(() => {
    if (!isLoaded || !user) return
    let cancelled = false
    getProfile().then(({ data, error }) => {
      if (cancelled) return
      if (data) setProfile(data)
      if (error) setMessage({ type: 'error', text: `Could not load profile: ${error}` })
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [isLoaded, user])

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    setMessage(null)

    const result = await createOrUpdateProfile(formData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-4">
          {user?.imageUrl && (
            <Image src={user.imageUrl} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Update Profile</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`mb-4 rounded-lg p-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="full_name" className={labelClassName}>
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              maxLength={200}
              defaultValue={profile?.full_name || user?.fullName || ''}
              className={inputClassName}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClassName}>
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              maxLength={50}
              defaultValue={profile?.phone || ''}
              className={inputClassName}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="address" className={labelClassName}>
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              maxLength={500}
              defaultValue={profile?.address || ''}
              className={inputClassName}
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label htmlFor="bio" className={labelClassName}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              maxLength={2000}
              defaultValue={profile?.bio || ''}
              className={inputClassName}
              placeholder="Tell us about yourself"
            />
          </div>

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
