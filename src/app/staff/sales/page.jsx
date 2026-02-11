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
import { IndianRupee, TrendingUp, Calendar } from 'lucide-react'

export default function SalesDashboard() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [yearlyTotal, setYearlyTotal] = useState(0)

  /* ================= FETCH SALES ================= */
  useEffect(() => {
    const fetchSales = async () => {
      const now = new Date()

      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )

      const startOfYear = new Date(
        now.getFullYear(),
        0,
        1
      )

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sold_at', { ascending: false })

      if (error) {
        console.error('Sales fetch error:', error)
      }

      if (data) {
        setSales(data)

        /* MONTHLY */
        const monthSales = data.filter(
          (s) =>
            s.sold_at &&
            new Date(s.sold_at) >= startOfMonth
        )

        setMonthlyTotal(
          monthSales.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
          )
        )

        /* YEARLY */
        const yearSales = data.filter(
          (s) =>
            s.sold_at &&
            new Date(s.sold_at) >= startOfYear
        )

        setYearlyTotal(
          yearSales.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
          )
        )
      }

      setLoading(false)
    }

    fetchSales()
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading sales dashboard…
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard
          title="This Month Sales"
          value={monthlyTotal}
          icon={<Calendar />}
          color="from-emerald-400 to-green-500"
        />
        <StatCard
          title="This Year Sales"
          value={yearlyTotal}
          icon={<TrendingUp />}
          color="from-indigo-400 to-purple-500"
        />
      </div>

      {/* SALES CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Chart (Last 7 Days)</CardTitle>
          <CardDescription>
            Total amount per day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart sales={sales} />
        </CardContent>
      </Card>

      {/* SALES HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice / Sales History</CardTitle>
          <CardDescription>
            Complete sales records
          </CardDescription>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {sales.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No sales records found.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th>Date</th>
                  <th>Invoice</th>
                  <th>Medicine</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td>
                      {s.sold_at
                        ? new Date(s.sold_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>{s.invoice_no || '—'}</td>
                    <td>{s.medicine_name || '—'}</td>
                    <td>{s.quantity || 0}</td>
                    <td className="font-semibold text-green-700">
                      ₹{s.amount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-400 uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800">
            ₹{value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center
          bg-gradient-to-br ${color} text-white`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

/* SIMPLE BAR CHART */
function SalesChart({ sales }) {
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const day = d.toISOString().slice(0, 10)

    const total = sales
      .filter(
        (s) =>
          s.sold_at &&
          s.sold_at.slice(0, 10) === day
      )
      .reduce((sum, s) => sum + Number(s.amount || 0), 0)

    return { day, total }
  }).reverse()

  const max = Math.max(...last7.map((d) => d.total), 1)

  return (
    <div className="flex gap-4 items-end h-40">
      {last7.map((d) => (
        <div key={d.day} className="flex flex-col items-center gap-2">
          <div
            className="w-8 bg-green-500 rounded"
            style={{
              height: `${(d.total / max) * 100}%`,
            }}
          />
          <span className="text-xs text-slate-500">
            {d.day.slice(8)}
          </span>
        </div>
      ))}
    </div>
  )
}
