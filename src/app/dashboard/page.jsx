'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

import {
  Search,
  Pill,
  ClipboardList,
  CheckCircle,
  Clock,
  Moon,
  Sun,
  User,
  HeartPulse,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)

      const { data } = await supabase
        .from('medicine_requests')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setRequests(data || [])
    }
    load()
  }, [])

  if (!user) {
    return <div className="py-20 text-center">Loading...</div>
  }

  return (
    <div
      className={`space-y-10 transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-slate-800'
      }`}
    >

      {/* ================= CREATIVE HEADER ================= */}
      <div
        className={`relative overflow-hidden rounded-3xl p-8
          ${
            darkMode
              ? 'bg-gradient-to-r from-slate-800 to-slate-900'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white'
          }`}
      >
        {/* Decorative blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <HeartPulse size={32} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Hi 👋 Welcome to <span className="underline decoration-white/40">Medistock</span>
              </h1>
              <p className="mt-2 text-sm opacity-90">
                Your personal medicine management dashboard
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                  USER DASHBOARD
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                  ROLE : USER
                </span>
              </div>
            </div>
          </div>

          {/* DARK MODE TOGGLE */}
          <Button
            variant="ghost"
            onClick={() => setDarkMode(!darkMode)}
            className="border border-white/30 hover:bg-white/20 text-white self-start md:self-auto"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Search Medicine',
            icon: <Search />,
            desc: 'Quickly find required medicines',
            route: '/dashboard/search-medicines',
          },
          {
            title: 'Available Medicines',
            icon: <Pill />,
            desc: 'View medicines currently in stock',
            route: '/dashboard/available-medicines',
          },
          {
            title: 'My Requests / Orders',
            icon: <ClipboardList />,
            desc: 'Track and manage your requests',
            route: '/dashboard/my-requests-orders',
          },
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => router.push(card.route)}
            className={`cursor-pointer rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl
              ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-white'
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              {card.icon}
            </div>

            <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
            <p
              className={`text-sm mt-1 ${
                darkMode ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ================= RECENT REQUESTS ================= */}
      <Card
        className={`rounded-2xl ${
          darkMode ? 'bg-slate-800 border-slate-700' : ''
        }`}
      >
        <CardHeader>
          <CardTitle>My Recent Requests</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {requests.length === 0 && (
            <p
              className={`text-sm ${
                darkMode ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              You haven’t made any medicine requests yet.
            </p>
          )}

          {requests.map((r) => (
            <div
              key={r.id}
              className={`flex justify-between items-center p-4 rounded-xl border
                ${
                  darkMode
                    ? 'border-slate-700 bg-slate-900'
                    : 'bg-slate-50'
                }`}
            >
              <div>
                <p className="font-semibold">{r.medicine_name}</p>
                <p
                  className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Quantity: {r.quantity}
                </p>
              </div>

              {r.status === 'approved' ? (
                <span className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                  <CheckCircle size={16} /> Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                  <Clock size={16} /> Pending
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
