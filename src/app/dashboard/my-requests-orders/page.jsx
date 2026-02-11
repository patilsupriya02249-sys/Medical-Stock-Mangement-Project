'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('medicine_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) {
      setRequests(data || [])
    }

    setLoading(false)
  }

  const statusColor = (status) => {
    if (status === 'approved') return 'text-blue-600'
    if (status === 'billed') return 'text-green-600'
    if (status === 'rejected') return 'text-red-600'
    return 'text-orange-600'
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Loading your orders…</p>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Medicine Orders</h1>

      {requests.length === 0 && (
        <p className="text-sm text-slate-500">
          You have not placed any medicine requests yet.
        </p>
      )}

      {requests.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>
              Order #{r.id.slice(0, 6)}
            </CardTitle>

            <span
              className={`text-sm font-semibold capitalize ${statusColor(
                r.status
              )}`}
            >
              {r.status}
            </span>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">

            {/* MEDICINES LIST */}
            {Array.isArray(r.items) &&
              r.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name}</span>
                  <span>
                    {i.qty} × ₹{i.selling_price}
                  </span>
                </div>
              ))}

            {/* TOTAL */}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{r.total}</span>
            </div>

            {/* STATUS MESSAGE */}
            {r.status === 'pending' && (
              <p className="text-xs text-orange-600">
                ⏳ Waiting for staff approval
              </p>
            )}

            {r.status === 'approved' && (
              <p className="text-xs text-blue-600">
                ✅ Approved by staff, billing in progress
              </p>
            )}

            {r.status === 'billed' && (
              <div className="pt-2">
                <p className="text-green-600 font-semibold text-sm">
                  🧾 Bill generated
                </p>

                {/* OPTIONAL: PRINT BILL */}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => window.print()}
                >
                  Print / Save Bill
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
