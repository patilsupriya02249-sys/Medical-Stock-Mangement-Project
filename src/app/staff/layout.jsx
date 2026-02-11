'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

import {
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  ListChecks,
  User,
  Pill,
  ClipboardList,
  CalendarClock,
  IndianRupee,
  FileText,
} from 'lucide-react'

import { useEffect, useState } from 'react'

export default function StaffLayout({ children }) {
  const router = useRouter()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-5">
        <h2 className="mb-6 text-xl font-bold text-blue-600">
          🏥 MedStock Staff
        </h2>

        <nav className="flex-1 space-y-4">

          <MenuSection title="MAIN">
            <NavLink href="/staff/dashboard" icon={<LayoutDashboard size={18} />}>
              Dashboard
            </NavLink>

            {/* ✅ REQUESTS LINK ADDED */}
            <NavLink href="/staff/requests" icon={<ClipboardList size={18} />}>
              Requests
            </NavLink>
          </MenuSection>

          <MenuSection title="INVENTORY">
            <NavLink href="/staff/medicines" icon={<Pill size={18} />}>
              Medicines
            </NavLink>
            <NavLink href="/staff/update-stock" icon={<ClipboardList size={18} />}>
              Update Stock
            </NavLink>
            <NavLink href="/staff/expiry-alerts" icon={<CalendarClock size={18} />}>

            
              Expiry Alerts
            </NavLink>
          </MenuSection>

          <MenuSection title="OPERATIONS">
            <NavLink href="/staff/sales" icon={<IndianRupee size={18} />}>
              Sales
            </NavLink>

            <NavLink href="/staff/billing" icon={<FileText size={18} />}>
              Billing Reports
            </NavLink>


            <NavLink href="/staff/tasks" icon={<ListChecks size={18} />}>
              Tasks
            </NavLink>
          </MenuSection>

          <MenuSection title="ACCOUNT">
            <NavLink href="/staff/profile" icon={<User size={18} />}>
              Profile
            </NavLink>
          </MenuSection>

        </nav>

        <p className="mt-4 text-xs text-slate-400">
          © MedStock System
        </p>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col">

        {/* TOP BAR */}
        <header className="flex h-14 items-center justify-between border-b bg-white dark:bg-slate-900 dark:border-slate-800 px-6">
          <span className="font-semibold">Welcome, Healthcare Staff 🩺</span>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button size="icon" variant="ghost" onClick={logout}>
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

/* ---------- HELPERS ---------- */

function NavLink({ href, icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-400"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

function MenuSection({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
        {title}
      </p>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}
