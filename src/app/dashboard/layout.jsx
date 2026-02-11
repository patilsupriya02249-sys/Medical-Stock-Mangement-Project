'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

import {
  Shield,
  LayoutDashboard,
  Search,
  Pill,
  ClipboardList,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // ================= AUTH =================
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
    }
    loadUser()
  }, [])

  // ================= THEME =================
  useEffect(() => {
    const savedTheme = localStorage.getItem('medistock-theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('medistock-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('medistock-theme', 'light')
    }
  }, [darkMode])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    )
  }

  const linkClass = (href) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
     ${
       pathname === href
         ? darkMode
           ? 'bg-slate-800 text-white'
           : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
         : darkMode
         ? 'text-slate-300 hover:bg-slate-800'
         : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
     }`

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300
      ${
        darkMode
          ? 'bg-slate-900 text-white'
          : 'bg-gradient-to-br from-slate-100 via-white to-slate-200'
      }`}
    >

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`w-72 border-r shadow-xl flex flex-col
        ${
          darkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white/80 backdrop-blur'
        }`}
      >
        {/* LOGO */}
        <div
          className={`px-6 py-6 flex items-center gap-3 border-b
          ${darkMode ? 'border-slate-800' : ''}`}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Shield className="text-white" />
          </div>
          <div>
            <p className="font-extrabold text-lg leading-tight">
              Medistock
            </p>
            <p
              className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Safe Management
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium">
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            href="/dashboard/search-medicines"
            className={linkClass('/dashboard/search-medicines')}
          >
            <Search size={18} /> Search Medicines
          </Link>

          <Link
            href="/dashboard/available-medicines"
            className={linkClass('/dashboard/available-medicines')}
          >
            <Pill size={18} /> Available Medicines
          </Link>

          <Link
            href="/dashboard/my-requests-orders"
            className={linkClass('/dashboard/my-requests-orders')}
          >
            <ClipboardList size={18} /> My Orders
          </Link>

          <div className="pt-4 border-t mt-4 border-slate-700">
            <Link
              href="/dashboard/profile"
              className={linkClass('/dashboard/profile')}
            >
              <User size={18} /> Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className={linkClass('/dashboard/settings')}
            >
              <Settings size={18} /> Settings
            </Link>
          </div>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl text-red-500 border-red-400 hover:bg-red-900/20"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header
          className={`h-16 border-b flex items-center justify-between px-8
          ${
            darkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white/70 backdrop-blur shadow-sm'
          }`}
        >
          <h1 className="text-xl font-bold tracking-tight">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {user.email}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
