'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { AlertTriangle, CalendarClock } from 'lucide-react'

export default function ExpiryAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpiryAlerts = async () => {
      const today = new Date()
      const limitDate = new Date()
      limitDate.setDate(today.getDate() + 30)

      const { data } = await supabase
        .from('medicines')
        .select('id, name, batch_no, expiry_date')
        .lte('expiry_date', limitDate.toISOString().slice(0, 10))
        .order('expiry_date')

      setAlerts(data || [])
      setLoading(false)
    }

    fetchExpiryAlerts()
  }, [])

  const daysLeft = (date) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Checking expiry alerts...
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">

      <Card className="shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">

        {/* HEADER */}
        <CardHeader className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6" />
            Expiry Alerts
          </CardTitle>
          <CardDescription className="text-red-100">
            Medicines expiring within 30 days
          </CardDescription>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-6 bg-white dark:bg-slate-900">

          {alerts.length === 0 ? (
            <div className="text-center text-green-600 font-semibold py-10">
              ✅ No medicines expiring soon
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((m) => {
                const left = daysLeft(m.expiry_date)
                const danger = left <= 7

                return (
                  <div
                    key={m.id}
                    className={`
                      flex justify-between items-center
                      p-4 rounded-lg border
                      hover:shadow-md transition
                      ${danger
                        ? 'bg-red-50 border-red-300 dark:bg-red-950'
                        : 'bg-orange-50 border-orange-300 dark:bg-orange-950'}
                    `}
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {m.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Batch: {m.batch_no}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-bold">
                      <CalendarClock
                        className={danger ? 'text-red-600' : 'text-orange-600'}
                        size={18}
                      />
                      <span
                        className={danger ? 'text-red-600' : 'text-orange-600'}
                      >
                        {left} days left
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </CardContent>
      </Card>

      <p className="text-xs text-center text-slate-400 mt-5">
        🔴 Red = expires within 7 days | 🟠 Orange = within 30 days
      </p>
    </div>
  )
}
