'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function Register() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // ✅ default user
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // 1️⃣ SUPABASE AUTH SIGNUP
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

      if (signUpError) {
        console.error(
          'Signup error:',
          JSON.stringify(signUpError, null, 2)
        )
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // ⚠️ Email confirmation ON case
      if (!data || !data.user) {
        setError(
          'Account created. Please verify your email, then login.'
        )
        setLoading(false)
        return
      }

      const user = data.user

      // 2️⃣ INSERT INTO profiles TABLE (user / staff / admin)
      const { error: profileError } = await supabase
  .from('profiles')
  .upsert(
    {
      id: user.id,
      name: formData.name,
      role: formData.role,
    },
    { onConflict: 'id' }
  )

      if (profileError) {
        console.error(
          'Profile insert error:',
          JSON.stringify(profileError, null, 2)
        )
        setError('Account created, but profile save failed')
        setLoading(false)
        return
      }

      setLoading(false)
      router.push('/login')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-600">
              Medical Stock Management
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Register for Medical Stock Management System
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <select
                name="role"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold"
                >
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
