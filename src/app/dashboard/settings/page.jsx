'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ArrowLeft,
  Bell,
  Lock,
  Save,
  Check,
  ShieldCheck,
  Clock,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [theme, setTheme] = useState('light')

  const [settings, setSettings] = useState({
    notifications: {
      expiredAlert: true,
      lowStockAlert: true,
      dailyReport: true,
    },
    privacy: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
  })

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data?.session) {
        router.replace('/login')
        return
      }

      const sessionUser = data.session.user
      setUser(sessionUser)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionUser.id)
        .single()

      setRole(profile?.role || 'user')
    }

    loadUser()
  }, [router])

  /* ================= THEME APPLY ================= */
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  /* ================= HANDLERS ================= */
  const toggleNotification = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const togglePrivacy = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value ?? !prev.privacy[key],
      },
    }))
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading settings…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* BACK */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage preferences, appearance & security
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* USER CARD */}
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-4 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {user.email[0].toUpperCase()}
              </div>
              <p className="font-semibold">{user.email}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {role.toUpperCase()}
              </span>
              <p className="text-xs text-green-600 font-medium">
                Account Active
              </p>
            </CardContent>
          </Card>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-6">

            {/* APPEARANCE */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Choose your preferred theme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                {[
                  { key: 'light', label: 'Light', icon: <Sun size={16} /> },
                  { key: 'dark', label: 'Dark', icon: <Moon size={16} /> },
                  { key: 'system', label: 'System', icon: <Laptop size={16} /> },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTheme(t.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition
                      ${
                        theme === t.key
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* NOTIFICATIONS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={18} /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <span className="capitalize text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleNotification(key)}
                        className="scale-110 accent-blue-600"
                      />
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* SECURITY */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck size={18} /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Lock size={16} />
                    Two-Factor Authentication
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.privacy.twoFactorAuth}
                    onChange={() => togglePrivacy('twoFactorAuth')}
                    className="scale-110 accent-green-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock size={16} />
                    Auto logout (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2"
                    value={settings.privacy.sessionTimeout}
                    onChange={(e) =>
                      togglePrivacy(
                        'sessionTimeout',
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* SAVE */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} />
                Save Changes
              </Button>

              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Check size={16} />
                  Saved
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
