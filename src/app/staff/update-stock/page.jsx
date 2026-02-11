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
import { Button } from '@/components/ui/button'
import { Pill, Save, Clock } from 'lucide-react'

export default function UpdateStock() {
  const [medicines, setMedicines] = useState([])
  const [recent, setRecent] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  /* ================= FETCH MEDICINES ================= */
  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('id, name, batch_no, quantity')
      .order('name')

    if (!error) setMedicines(data || [])
  }

  /* ================= FETCH RECENT ================= */
  const fetchRecent = async () => {
    const { data } = await supabase
      .from('medicines')
      .select('id, name, batch_no, quantity, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5)

    setRecent(data || [])
  }

  useEffect(() => {
    fetchMedicines()
    fetchRecent()
  }, [])

  /* ================= UPDATE STOCK ================= */
  const updateStock = async () => {
    if (!selectedId || qty === '') {
      setMessage('⚠️ Please select medicine and enter quantity')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('medicines')
      .update({
        quantity: Number(qty),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedId)
      .select()

    /* 🔴 REAL ERROR HANDLING */
    if (error) {
      console.log('SUPABASE ERROR:', error)
      setMessage(`❌ ${error.message || 'Update failed'}`)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setMessage('❌ Update blocked (permission or invalid ID)')
      setLoading(false)
      return
    }

    /* ✅ SUCCESS */
    setMessage('✅ Stock updated successfully')
    setQty('')
    setSelectedId('')

    await fetchMedicines()
    await fetchRecent()

    setLoading(false)
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">

      {/* UPDATE CARD */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Pill /> Update Medicine Quantity
          </CardTitle>
          <CardDescription className="text-blue-100">
            Quantity update reflects everywhere
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 p-6">

          <div>
            <label className="text-sm font-medium">
              Medicine (Batch No • Current Quantity)
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">-- Select Medicine --</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} | {m.batch_no} | Qty: {m.quantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">New Quantity</label>
            <input
              type="number"
              min="0"
              className="w-full mt-1 p-2 border rounded"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Enter updated quantity"
            />
          </div>

          {message && (
            <p className="text-sm font-semibold">{message}</p>
          )}

          <Button
            onClick={updateStock}
            disabled={loading}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Updating…' : 'Update Quantity'}
          </Button>

        </CardContent>
      </Card>

      {/* RECENT UPDATES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">
              No recent updates
            </p>
          ) : (
            recent.map((m) => (
              <div
                key={m.id}
                className="flex justify-between border p-3 rounded"
              >
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-slate-500">
                    Batch No: {m.batch_no}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Qty: {m.quantity}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(m.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

    </div>
  )
}
