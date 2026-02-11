'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Package,
  AlertTriangle,
  Clock,
  IndianRupee
} from 'lucide-react'

export default function MedicalDashboard() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  const [total, setTotal] = useState(0)
  const [lowStock, setLowStock] = useState([])
  const [expiring, setExpiring] = useState([])

  useEffect(() => {
    fetchMedicines()
  }, [])

  async function fetchMedicines() {
    setLoading(true)

    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      setLoading(false)
      return
    }

    setMedicines(data)
    setTotal(data.length)

    const today = new Date()
    const next30 = new Date()
    next30.setDate(today.getDate() + 30)

    const low = []
    const exp = []

    data.forEach((med) => {
      if (med.quantity <= med.min_stock) {
        low.push(med)
      }

      const expiry = new Date(med.expiry_date)
      if (expiry <= next30) {
        exp.push(med)
      }
    })

    setLowStock(low)
    setExpiring(exp)
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-800">
            Medical Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Monitor medicine stock, expiry alerts, and inventory health in real time.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Total Medicines */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Medicines</p>
                <h2 className="text-3xl font-bold mt-1">{total}</h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Package className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Low Stock Items</p>
                <h2 className="text-3xl font-bold text-yellow-500 mt-1">
                  {lowStock.length}
                </h2>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertTriangle className="text-yellow-600" size={28} />
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expiring Soon</p>
                <h2 className="text-3xl font-bold text-red-500 mt-1">
                  {expiring.length}
                </h2>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <Clock className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Expiry Alerts */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Expiry Alerts
            </h2>

            {expiring.length === 0 ? (
              <p className="text-slate-500">
                No medicines expiring in the next 30 days.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="text-left py-2">Name</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {expiring.map((med) => (
                    <tr key={med.id} className="border-b hover:bg-red-50">
                      <td className="py-2 font-medium">{med.name}</td>
                      <td>{med.batch_no}</td>
                      <td>{med.quantity}</td>
                      <td className="text-red-500 font-semibold">
                        {med.expiry_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Low Stock Alerts
            </h2>

            {lowStock.length === 0 ? (
              <p className="text-slate-500">
                All medicines are sufficiently stocked.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="text-left py-2">Name</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>Min</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((med) => (
                    <tr key={med.id} className="border-b hover:bg-yellow-50">
                      <td className="py-2 font-medium">{med.name}</td>
                      <td>{med.batch_no}</td>
                      <td className="text-yellow-600 font-semibold">
                        {med.quantity}
                      </td>
                      <td>{med.min_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white p-8 rounded-2xl shadow mt-10">
          <h2 className="text-2xl font-semibold mb-2">
            Inventory Health Overview
          </h2>
          <p className="opacity-90 max-w-2xl">
            This dashboard provides real-time monitoring of medicine stock levels,
            expiry alerts, and inventory performance. Keeping track of low stock
            and expiring medicines helps reduce wastage, prevent shortages,
            and ensure patient safety.
          </p>
        </div>

      </div>
    </main>
  )
}
