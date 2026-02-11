'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  User,
  Lock,
  Save,
  LogOut,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  // ======================
  // LOAD USER SAFELY
  // ======================
  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data?.session?.user) {
        router.push('/login')
        return
      }

      const currentUser = data.session.user
      setUser(currentUser)

      // 👇 ONLY AFTER user exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', currentUser.id)
        .single()

      setRole(profile?.role || 'user')
      setName(profile?.name || '')
      setLoading(false)
    }

    loadProfile()
  }, [router])

  // ======================
  // UPDATE PROFILE
  // ======================
  const handleProfileUpdate = async () => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)

    if (error) {
      alert(error.message)
      return
    }

    setSuccess('Profile updated successfully')
    setTimeout(() => setSuccess(''), 2000)
  }

  // ======================
  // CHANGE PASSWORD
  // ======================
  const handlePasswordChange = async () => {
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert(error.message)
      return
    }

    setPassword('')
    setSuccess('Password changed successfully')
    setTimeout(() => setSuccess(''), 2000)
  }

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-blue-600 mb-6"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* PROFILE INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} /> Profile Information
            </CardTitle>
            <CardDescription>
              Manage your personal account details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                disabled
                value={user.email}
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Role</label>
              <input
                disabled
                value={role}
                className="w-full border px-3 py-2 rounded bg-gray-100 capitalize"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter your name"
              />
            </div>

            <Button onClick={handleProfileUpdate} className="gap-2">
              <Save size={16} /> Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* PASSWORD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} /> Change Password
            </CardTitle>
            <CardDescription>
              Update your account password securely
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter new password"
              />
            </div>

            <Button onClick={handlePasswordChange} className="gap-2">
              <Lock size={16} /> Change Password
            </Button>
          </CardContent>
        </Card>

        {/* SUCCESS */}
        {success && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* LOGOUT */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full text-red-600 gap-2"
        >
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </main>
  )
}

