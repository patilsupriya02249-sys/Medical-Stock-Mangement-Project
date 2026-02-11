'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LowStock() {
  const [meds, setMeds] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('medicines')
        .select('*')
        .lt('quantity', 20)
        .order('quantity')
      setMeds(data || [])
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meds.map((m) => (
            <div
              key={m.id}
              className="border p-3 rounded bg-red-50"
            >
              <p className="font-bold">{m.name}</p>
              <p>Batch: {m.batch_no}</p>
              <p className="text-red-600">
                Stock Left: {m.quantity}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
