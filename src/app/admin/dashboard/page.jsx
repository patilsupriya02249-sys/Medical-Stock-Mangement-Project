'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  Package,
  LayoutDashboard,
  Pill,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  TrendingUp,
  Activity,
  Boxes,
  PackageCheck,
  CalendarX,
  TrendingDown,
  HeartPulse,
  Bell,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  /* ADD MEDICINE STATE */
  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [medicine, setMedicine] = useState({
    name: '',
    quantity: '',
    expiry: '',
  })

  /* OVERALL STATUS STATE */
  const [overall, setOverall] = useState({
    totalStock: 0,
    lowStock: 0,
    expired: 0,
    issued: 0,
  })

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role,email')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setUser({ email: profile.email || user.email })
    }

    checkAdmin()
  }, [router])

  /* ================= OVERALL STATS ================= */
  useEffect(() => {
    const loadOverallStats = async () => {
      const { data: stockIn } = await supabase
        .from('stock_in')
        .select('medicine_name,batch_no,expiry,quantity')

      const { data: stockOut } = await supabase
        .from('stock_out')
        .select('medicine_name,batch_no,quantity')

      const map = {}
      let issued = 0

      stockIn?.forEach(i => {
        const key = `${i.medicine_name}-${i.batch_no}`
        if (!map[key]) {
          map[key] = { expiry: i.expiry, inQty: 0, outQty: 0 }
        }
        map[key].inQty += i.quantity
      })

      stockOut?.forEach(o => {
        const key = `${o.medicine_name}-${o.batch_no}`
        if (map[key]) map[key].outQty += o.quantity
        issued += o.quantity
      })

      const today = new Date().toISOString().split('T')[0]
      let totalStock = 0
      let lowStock = 0
      let expired = 0

      Object.values(map).forEach(i => {
        const qty = i.inQty - i.outQty
        totalStock += qty
        if (qty <= 10) lowStock++
        if (i.expiry < today) expired++
      })

      setOverall({ totalStock, lowStock, expired, issued })
    }

    loadOverallStats()
  }, [])

  if (!user) return null

  const stats = [
    { label: 'Total Medicines', value: 245, icon: Pill },
    { label: 'Low Stock Alerts', value: 8, icon: TrendingUp },
    { label: 'System Status', value: 'Active', icon: Activity },
  ]

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main className="min-h-screen flex bg-slate-100 dark:bg-slate-900">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r">
          <div className="p-5 flex items-center gap-2 font-bold text-xl text-blue-600">
            <Package /> MedStock
          </div>

          <nav className="px-4 space-y-1 text-sm">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => router.push('/admin/dashboard')} />
            <NavItem icon={Pill} label="Medicines" onClick={() => router.push('/admin/medicines')} />
            <NavItem icon={Boxes} label="Stock Management" onClick={() => router.push('/admin/stock')} />
            <NavItem icon={Users} label="Staff" onClick={() => router.push('/admin/staff')} />
            <NavItem icon={Users} label="Users" onClick={() => router.push('/admin/users')} />
            <NavItem icon={FileBarChart} label="Reports" onClick={() => router.push('/admin/reports')} />
            <NavItem icon={Settings} label="Settings" onClick={() => router.push('/admin/settings')} />
            <NavItem icon={User} label="Profiles" onClick={() => router.push('/admin/profiles')} />
          </nav>
        </aside>

        {/* ================= MAIN ================= */}
        <div className="flex-1">

          {/* ================= HEADER ================= */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b flex justify-between items-center px-6">
            <div>
              <h1 className="font-semibold text-lg">
                Medistock Management System
              </h1>
              <p className="text-xs text-slate-500">
                Admin Dashboard – Inventory & User Control
              </p>
            </div>

            {/* 🔔 RIGHT SIDE BUTTONS */}
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost">
                <Bell />
              </Button>

             

              <span className="text-sm">{user.email}</span>

              <Button size="icon" variant="ghost" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun /> : <Moon />}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* ================= CONTENT ================= */}
          <div className="p-6 space-y-6">

            {/* WELCOME */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-1">
                  Welcome, Admin 👋
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor inventory status and manage the system efficiently.
                </p>
              </CardContent>
            </Card>

            {/* 🌈 OVERALL MEDICAL STATUS */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatusCard title="Total Stock" value={overall.totalStock} icon={<PackageCheck />} color="from-green-500 to-emerald-500" />
              <StatusCard title="Low Stock" value={overall.lowStock} icon={<HeartPulse />} color="from-yellow-500 to-orange-500" />
              <StatusCard title="Expired" value={overall.expired} icon={<CalendarX />} color="from-red-500 to-pink-500" />
              <StatusCard title="Issued / Usage" value={overall.issued} icon={<TrendingDown />} color="from-indigo-500 to-purple-500" />
            </div>

            {/* OLD STATS */}
            <div className="grid md:grid-cols-3 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon
                return (
                  <Card key={i}>
                    <CardContent className="pt-6 flex items-center gap-4">
                      <Icon className="text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* ➕ ADD MEDICINE BUTTON */}
            <Button onClick={() => setShowAddMedicine(!showAddMedicine)}>
              ➕ Add Medicine
            </Button>

            {showAddMedicine && (
              <Card className="max-w-xl">
                <CardHeader>
                  <CardTitle>Add Medicine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Medicine Name"
                    value={medicine.name}
                    onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
                  />
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Quantity"
                    value={medicine.quantity}
                    onChange={(e) => setMedicine({ ...medicine, quantity: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border p-2 w-full rounded"
                    value={medicine.expiry}
                    onChange={(e) => setMedicine({ ...medicine, expiry: e.target.value })}
                  />
                  <Button>Save Medicine</Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function NavItem({ icon: Icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer
                 hover:bg-blue-50 dark:hover:bg-slate-700"
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  )
}

function StatusCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  )
}
