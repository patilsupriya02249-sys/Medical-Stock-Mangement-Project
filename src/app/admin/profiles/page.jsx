'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ShieldCheck,
  Save,
  Lock,
  LogOut,
  Activity,
  Calendar,
} from 'lucide-react'

export default function AdminProfilesPage() {
  const [profile, setProfile] = useState(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)

    const { data: authData, error: authError } =
      await supabase.auth.getUser()

    if (authError || !authData?.user) {
      console.error('Auth error', authError)
      setLoading(false)
      return
    }

    const user = authData.user
    setEmail(user.email || '')

    // 🔹 TRY FETCH PROFILE
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profile fetch error:', error)
      setLoading(false)
      return
    }

    // 🔹 CREATE PROFILE IF NOT EXISTS
    if (!data) {
      const { data: created, error: insertError } =
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.email.split('@')[0],
            role: 'admin',
          })
          .select()
          .single()

      if (insertError) {
        console.error('Profile insert error:', insertError)
        setLoading(false)
        return
      }

      setProfile(created)
      setName(created.full_name)
      setLoading(false)
      return
    }

    // Admin only
    if (data.role !== 'admin') {
      window.location.replace('/unauthorized')
      return
    }

    setProfile(data)
    setName(data.full_name || '')
    setLoading(false)
  }

  async function updateProfile() {
    if (!name.trim()) return alert('Name required')

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim() })
      .eq('id', profile.id)

    if (error) alert(error.message)
    else alert('Profile updated')
  }

  async function changePassword() {
    if (!newPassword || !confirmPassword)
      return alert('Fill all fields')

    if (newPassword !== confirmPassword)
      return alert('Password mismatch')

    if (newPassword.length < 6)
      return alert('Minimum 6 characters')

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) alert(error.message)
    else {
      alert('Password updated')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile…
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Admin Profile</h1>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <label>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label>Email</label>
              <div className="border p-2 bg-gray-100 rounded">
                {email}
              </div>
            </div>

            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck /> Admin Access
            </div>

            <div className="flex gap-4">
              <Button onClick={updateProfile}>
                <Save size={16} /> Save
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut size={16} /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex gap-2">
              <Lock /> Security
            </h2>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="border p-2 rounded"
            />
            <Button onClick={changePassword}>
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex gap-2">
              <Activity /> Activity
            </h2>
          </CardHeader>
          <CardContent className="text-sm">
            <p>• Stock management</p>
            <p>• Sales review</p>
            <p>• System control</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
