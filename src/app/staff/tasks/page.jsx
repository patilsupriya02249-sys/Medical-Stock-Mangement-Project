'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TasksPage() {
  const [dark, setDark] = useState(false)

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Check medicine expiry dates', done: true },
    { id: 2, title: 'Verify stock quantity in storage', done: false },
    { id: 3, title: 'Update medicine records in system', done: false },
    { id: 4, title: 'Report low-stock medicines to supervisor', done: false },
  ])

  /* 🌗 LIGHT / DARK MODE */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const completed = tasks.filter(t => t.done).length
  const progress = Math.round((completed / tasks.length) * 100)

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* TOP BAR */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
        <h1 className="text-xl font-semibold tracking-tight">
          Staff Task Management
        </h1>

        <Button variant="outline" onClick={() => setDark(!dark)}>
          {dark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </header>

      {/* PAGE INTRO */}
      <section className="px-10 py-10 max-w-5xl">
        <h2 className="text-2xl font-semibold mb-2">
          Daily Responsibilities
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          This section outlines assigned duties for staff members.  
          Tasks must be completed carefully to ensure accuracy, safety,
          and proper medical stock management.
        </p>
      </section>

      {/* PROGRESS + VISUAL GRAPH */}
      <section className="px-10 max-w-5xl grid md:grid-cols-2 gap-12 items-center">

        {/* PROGRESS INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Task Completion Status
          </h3>

          <p className="text-4xl font-bold mb-1">
            {progress}%
          </p>

          <p className="text-sm text-slate-500 mb-4">
            {completed} of {tasks.length} tasks completed
          </p>

          {/* PROGRESS BAR */}
          <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800">
            <div
              className="h-3 rounded bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Consistent completion improves workflow efficiency and safety.
          </p>
        </div>

        {/* SIMPLE GRAPH (NO LIBRARY) */}
        <div className="flex items-end gap-6 h-40">
          {tasks.map(task => (
            <div key={task.id} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 rounded transition-all
                  ${task.done
                    ? 'bg-blue-600 h-32'
                    : 'bg-slate-300 dark:bg-slate-700 h-16'}
                `}
              />
              <span className="text-xs mt-2 text-slate-500">
                Task {task.id}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* TASK LIST */}
      <section className="px-10 py-12 max-w-5xl">

        <h3 className="text-lg font-semibold mb-4">
          Assigned Tasks
        </h3>

        <div className="border rounded-lg divide-y dark:border-slate-800">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-4 px-6 py-4"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center
                  ${task.done
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-400 dark:border-slate-700'}
                `}
              >
                {task.done && <Check size={14} />}
              </button>

              <p
                className={`flex-1 text-sm
                  ${task.done
                    ? 'line-through text-slate-400'
                    : ''}
                `}
              >
                {task.title}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full
                  ${task.done
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}
                `}
              >
                {task.done ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>

      </section>
    </main>
  )
}
