'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Pill, IndianRupee, CheckCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AvailableMedicinesPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  // ===============================
  // FETCH AVAILABLE MEDICINES
  // ===============================
  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('id, name, selling_price')
      .gt('quantity', 0) // only available internally
      .order('name')

    if (!error) {
      setMedicines(data || [])
    } else {
      console.error('Fetch medicines error:', error)
      setMedicines([])
    }

    setLoading(false)
  }

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 text-white p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Available Medicines
        </h1>
        <p className="text-sm opacity-90 mt-2">
          Medicines currently in stock and ready for request
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      {loading && (
        <p className="text-sm text-slate-500">
          Loading medicines, please wait...
        </p>
      )}

      {!loading && medicines.length === 0 && (
        <p className="text-sm text-slate-500">
          No medicines available at the moment
        </p>
      )}

      {!loading && medicines.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((m) => (
            <Card
              key={m.id}
              className="rounded-2xl hover:shadow-lg transition-all"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Pill size={20} />
                  </div>
                  {m.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex justify-between items-center pt-2">
                {/* Availability badge (NO QUANTITY) */}
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <CheckCircle size={14} />
                  Available
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 text-green-700 font-bold">
                  <IndianRupee size={16} />
                  {m.selling_price ?? 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
