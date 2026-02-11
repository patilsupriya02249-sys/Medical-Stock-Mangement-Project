'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, ShieldCheck, Moon, Sun } from 'lucide-react'

export default function ProfilePage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
        <h1 className="text-xl font-semibold tracking-tight">
          Staff Profile
        </h1>

        <Button variant="outline" onClick={() => setDark(!dark)}>
          {dark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </header>

      {/* ================= PROFILE SUMMARY ================= */}
      <section className="px-10 pt-10 max-w-6xl">
        <Card className="p-6 flex items-center gap-6 bg-white dark:bg-slate-900 shadow-sm">

          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <User className="w-10 h-10" />
          </div>

          {/* BASIC INFO */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              Medical Store Staff
            </h2>
            <p className="text-sm text-slate-500">
              Pharmacy Department • Hospital Inventory Unit
            </p>

            <div className="flex gap-3 mt-3">
              <Badge text="Staff" />
              <Badge text="Active" success />
              <Badge text="Verified" icon={<ShieldCheck className="w-3 h-3" />} />
            </div>
          </div>
        </Card>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="px-10 py-10 max-w-6xl grid md:grid-cols-2 gap-10">

        {/* LEFT – STAFF DETAILS */}
        <Card className="p-6 space-y-5 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-slate-800">
            Staff Information
          </h3>

          <ProfileRow label="Role" value="Staff" />
          <ProfileRow label="Department" value="Pharmacy" />
          <ProfileRow label="Designation" value="Medical Store Assistant" />
          <ProfileRow label="Employment Type" value="Full Time" />
          <ProfileRow label="Status" value="Active" status />

          <p className="text-xs text-slate-400 pt-3">
            This information is controlled by hospital administration.
          </p>
        </Card>

        {/* RIGHT – RESPONSIBILITIES */}
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-semibold border-b pb-2 dark:border-slate-800">
            Assigned Responsibilities
          </h3>

          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li>• Monitor and report medicine expiry dates</li>
            <li>• Maintain accurate inventory records</li>
            <li>• Handle medicine billing & stock deduction</li>
            <li>• Ensure compliance with safety standards</li>
            <li>• Coordinate with admin during audits</li>
          </ul>

          {/* RESPONSIBILITY LEVEL */}
          <div className="pt-4 border-t dark:border-slate-800">
            <p className="text-sm font-medium">
              Responsibility Level
            </p>
            <p className="text-xs text-slate-500 mt-1">
              High — precision and accountability required
            </p>

            <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-slate-800 rounded">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded w-[85%]" />
            </div>
          </div>
        </Card>
      </section>

      {/* ================= FOOTER NOTE ================= */}
      <footer className="px-10 pb-10 max-w-6xl">
        <p className="text-xs text-slate-400">
          This profile is part of the Medical Stock Management System and is intended
          strictly for internal operational use.
        </p>
      </footer>

    </main>
  )
}

/* ================= HELPERS ================= */

function ProfileRow({ label, value, status }) {
  return (
    <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800">
      <span className="text-sm text-slate-500">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          status ? 'text-green-600 dark:text-green-400' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Badge({ text, success, icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
        ${success
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
      `}
    >
      {icon}
      {text}
    </span>
  )
}
