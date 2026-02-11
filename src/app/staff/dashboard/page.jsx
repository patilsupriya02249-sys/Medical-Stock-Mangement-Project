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
  Package,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react'

export default function StaffDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [tasks, setTasks] = useState([
    { id: 1, task: 'Check medicine expiry dates', status: 'Pending' },
    { id: 2, task: 'Restock Aspirin 500mg', status: 'Pending' },
  ])

  const [newTask, setNewTask] = useState('')
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [reports, setReports] = useState(0)
  const [alerts, setAlerts] = useState(2)
  const [clockedOut, setClockedOut] = useState(false)

  /* 🔐 AUTH + ROLE CHECK */
  useEffect(() => {
    const checkStaff = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error || profile?.role !== 'staff') {
        router.push('/unauthorized')
        return
      }

      setLoading(false)
    }

    checkStaff()
  }, [router])

  if (loading) return null

  /* ---------- FUNCTIONS ---------- */

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        task: newTask,
        status: 'Pending',
      },
    ])
    setNewTask('')
    setShowTaskInput(false)
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status: 'Completed' } : t
      )
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-blue-700">
              MedStock • Staff Panel
            </span>
          </Link>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        {/* 🌟 MOTIVATIONAL CARD */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-1">
              Welcome, Healthcare Hero 🩺
            </h2>
            <p className="text-sm opacity-90">
              “Your dedication ensures safety, care, and trust. Every task you complete saves lives.”
            </p>
          </CardContent>
        </Card>

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          <Stat title="Total Tasks" value={tasks.length} />
          <Stat
            title="Completed"
            value={tasks.filter(t => t.status === 'Completed').length}
            success
          />
          <Stat title="Reports Submitted" value={reports} />
          <Stat title="Active Alerts" value={alerts} warning />
        </div>


        {/* 🧾 REQUESTS QUICK ACCESS (✅ ADDED) */}
        <Link href="/staff/requests">
          <Card className="mb-10 cursor-pointer hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList />
                Medicine Requests
              </CardTitle>
              <CardDescription>
                View and manage user medicine requests
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* 📝 TASK MANAGEMENT */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Daily Responsibilities</CardTitle>
              <CardDescription>
                Complete tasks with accuracy & responsibility
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowTaskInput(true)}>
              + New Task
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">

            {showTaskInput && (
              <div className="flex gap-2">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task..."
                  className="flex-1 border rounded px-3 py-2"
                />
                <Button onClick={addTask}>Add</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTaskInput(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-lg border
                ${task.status === 'Completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white'}
                `}
              >
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => toggleTask(task.id)}
                />

                <div className="flex-1">
                  <p className="font-semibold">{task.task}</p>
                  <p className="text-xs text-slate-500">
                    Status: {task.status}
                  </p>
                </div>

                {task.status === 'Completed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ⚡ QUICK ACTIONS */}
        <div className="grid md:grid-cols-4 gap-3 mt-6">
          <Button variant="outline" onClick={() => setReports(reports + 1)}>
            Submit Daily Report 📄
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setTasks(tasks.map(t => ({ ...t, status: 'Completed' })))
            }
          >
            Complete All Tasks ✅
          </Button>

          <Button variant="outline" onClick={() => setAlerts(alerts + 1)}>
            Report Safety Issue ⚠️
          </Button>

          <Button
            variant="outline"
            onClick={() => setClockedOut(true)}
          >
            {clockedOut ? 'Shift Completed 🌙' : 'End Shift ⏱️'}
          </Button>
        </div>
      </div>
    </main>
  )
}

/* 📦 SMALL STAT COMPONENT */
function Stat({ title, value, success, warning }) {
  let color = 'text-blue-600'
  let icon = null

  if (success) {
    color = 'text-green-600'
    icon = <CheckCircle2 className="w-4 h-4 text-green-600" />
  }

  if (warning) {
    color = 'text-red-600'
    icon = <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">{title}</p>
          {icon}
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-400 mt-1">
          Stay disciplined & focused
        </p>
      </CardContent>
    </Card>
  )
}
