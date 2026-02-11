'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function StaffRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  /* ================= LOAD REQUESTS ================= */
  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('medicine_requests')
      .select('id, items, total, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      setRequests([])
    } else {
      setRequests(data || [])
    }

    setLoading(false)
  }

  /* ================= APPROVE REQUEST ================= */
  const approveRequest = async (id) => {
    const { error } = await supabase
      .from('medicine_requests')
      .update({ status: 'approved' })
      .eq('id', id)

    if (error) {
      console.error('Approve error:', error)
      alert('Failed to approve request')
      return
    }

    loadRequests()
  }

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading medicine requests…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Medicine Requests
      </h1>

      {requests.length === 0 && (
        <p className="text-slate-500">
          No requests found
        </p>
      )}

      {requests.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              Request #{r.id.slice(0, 6)}
            </CardTitle>

            <span
              className={`text-sm font-semibold capitalize
                ${
                  r.status === 'pending'
                    ? 'text-orange-600'
                    : r.status === 'approved'
                    ? 'text-blue-600'
                    : r.status === 'billed'
                    ? 'text-green-600'
                    : 'text-slate-600'
                }`}
            >
              {r.status}
            </span>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">

            {/* ITEMS */}
            {Array.isArray(r.items) &&
              r.items.map((i, idx) => (
                <div
                  key={idx}
                  className="flex justify-between"
                >
                  <span>{i.name}</span>
                  <span>
                    {i.qty} × ₹{i.selling_price}
                  </span>
                </div>
              ))}

            {/* TOTAL */}
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{r.total}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">

              {r.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => approveRequest(r.id)}
                >
                  Approve
                </Button>
              )}

              {r.status === 'approved' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/staff/billing?requestId=${r.id}`
                    )
                  }
                >
                  Generate Bill
                </Button>
              )}

              {r.status === 'billed' && (
                <span className="text-green-600 font-semibold text-sm">
                  ✔ Bill Generated
                </span>
              )}

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
