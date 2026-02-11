'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Search, Pill, PlusCircle, IndianRupee } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SearchMedicinesPage() {
  const [query, setQuery] = useState('')
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState([])
  const [qtyMap, setQtyMap] = useState({})
  const [loading, setLoading] = useState(false)

  /* ================= LOAD MEDICINES ================= */
  useEffect(() => {
    const loadMedicines = async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('id, name, selling_price')
        .order('name')

      if (error) {
        console.error('Load medicines error:', error)
        return
      }

      setMedicines(data || [])
    }

    loadMedicines()
  }, [])

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('id, name, selling_price')
      .ilike('name', `%${query}%`)
      .order('name')

    if (error) {
      console.error('Search error:', error)
      return
    }

    setMedicines(data || [])
  }

  /* ================= ADD TO ORDER ================= */
  const addToOrder = (m) => {
    const qty = Number(qtyMap[m.id])
    const price = Number(m.selling_price || 0)

    if (!qty || qty <= 0) {
      alert('Please enter valid quantity')
      return
    }

    if (cart.some((c) => c.id === m.id)) {
      alert('Medicine already added')
      return
    }

    setCart((prev) => [
      ...prev,
      {
        id: m.id,
        name: m.name,
        qty,
        selling_price: price,
        total: qty * price,
      },
    ])

    setQtyMap((prev) => ({ ...prev, [m.id]: '' }))
  }

  /* ================= PROCEED ================= */
  const proceed = async () => {
    if (loading || cart.length === 0) return

    setLoading(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        alert('Please login first')
        setLoading(false)
        return
      }

      const totalAmount = cart.reduce((s, i) => s + Number(i.total), 0)

      const { error } = await supabase
        .from('medicine_requests')
        .insert([
          {
            user_id: user.id,
            items: cart, // JSON / JSONB
            total: totalAmount,
            status: 'pending',
          },
        ])

      if (error) {
        console.error('Insert error:', error)
        alert(error.message || 'Failed to place request')
        setLoading(false)
        return
      }

      alert('Medicine request placed successfully')
      setCart([])
      setQtyMap({})
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = cart.reduce((s, i) => s + Number(i.total), 0)

  return (
    <div className="space-y-8">

      {/* SEARCH */}
      <Card>
        <CardContent className="p-6 flex gap-3">
          <Input
            placeholder="Search medicine..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>
        </CardContent>
      </Card>

      {/* MEDICINES */}
      <div className="grid md:grid-cols-3 gap-6">
        {medicines.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Pill />
                <span className="font-semibold">{m.name}</span>
              </div>

              <div className="flex items-center gap-1 text-green-600 font-bold">
                <IndianRupee size={14} />
                {m.selling_price ?? 0}
              </div>

              <Input
                type="number"
                placeholder="Qty"
                value={qtyMap[m.id] || ''}
                onChange={(e) =>
                  setQtyMap((prev) => ({
                    ...prev,
                    [m.id]: e.target.value,
                  }))
                }
              />

              <Button onClick={() => addToOrder(m)}>
                <PlusCircle className="w-4 h-4 mr-1" />
                Add to Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📦 Order Request</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {cart.map((i) => (
              <div
                key={i.id}
                className="flex justify-between text-sm border-b pb-2"
              >
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-slate-500">
                    Qty: {i.qty} × ₹{i.selling_price}
                  </p>
                </div>
                <p className="font-semibold">₹{i.total}</p>
              </div>
            ))}

            <div className="flex justify-between font-bold pt-2">
              <span>Total</span>
              <span className="text-green-700">₹{totalAmount}</span>
            </div>

            <Button
              className="w-full mt-3"
              onClick={proceed}
              disabled={loading}
            >
              {loading ? 'Placing Request…' : 'Proceed (Place Request)'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
