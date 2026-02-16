'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function BillingClient() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('requestId')

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ================= LOAD BILL DATA ================= */
  useEffect(() => {
    if (!requestId) {
      setLoading(false)
      setError('Request ID missing')
      return
    }

    const load = async () => {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('medicine_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error || !data) {
        setError('Billing data not accessible')
        setLoading(false)
        return
      }

      setRequest(data)
      setLoading(false)
    }

    load()
  }, [requestId])

  /* ================= GENERATE BILL ================= */
  const generateBill = async () => {
    if (!request) return

    const invoiceNo = `INV-${Date.now()}`

    for (const item of request.items) {
      const { data: med, error: fetchErr } = await supabase
        .from('medicines')
        .select('quantity')
        .eq('id', item.id)
        .single()

      if (fetchErr || !med) {
        alert(`Stock fetch failed for ${item.name}`)
        return
      }

      const newQty =
        Number(med.quantity) - Number(item.qty)

      if (newQty < 0) {
        alert(`Insufficient stock for ${item.name}`)
        return
      }

      const { error: updateErr } = await supabase
        .from('medicines')
        .update({ quantity: newQty })
        .eq('id', item.id)

      if (updateErr) {
        alert(`Stock update failed for ${item.name}`)
        return
      }

      const { error: saleErr } =
        await supabase.from('sales').insert([
          {
            medicine_id: item.id,
            medicine_name: item.name,
            quantity: item.qty,
            amount:
              Number(item.qty) *
              Number(item.selling_price),
            invoice_no: invoiceNo,
            sold_at: new Date().toISOString(),
          },
        ])

      if (saleErr) {
        alert(`Sales insert failed for ${item.name}`)
        return
      }
    }

    await supabase
      .from('medicine_requests')
      .update({ status: 'billed' })
      .eq('id', requestId)

    alert('Bill generated successfully')
    window.print()
  }

  /* ================= UI ================= */

  if (loading) {
    return (
      <p className="p-6 text-slate-600">
        Loading bill…
      </p>
    )
  }

  if (error === 'Request ID missing') {
    return (
      <p className="p-6 text-slate-600">
        Please open billing from <b>Requests → Generate Bill</b>
      </p>
    )
  }

  if (error) {
    return (
      <p className="p-6 text-red-600">
        {error}
      </p>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="border rounded p-6 bg-white">
        <h2 className="text-xl font-bold text-center mb-4">
          Medical Store Invoice
        </h2>

        <p className="text-sm text-center mb-6">
          Request ID: {request.id}
        </p>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Medicine</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((i, idx) => (
              <tr key={idx}>
                <td className="border p-2">{i.name}</td>
                <td className="border p-2 text-center">{i.qty}</td>
                <td className="border p-2 text-center">₹{i.selling_price}</td>
                <td className="border p-2 text-center">
                  ₹{Number(i.qty) * Number(i.selling_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4 font-bold">
          Total: ₹{request.total}
        </div>
      </div>

      {request.status !== 'billed' ? (
        <button
          onClick={generateBill}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded"
        >
          Generate & Print Bill
        </button>
      ) : (
        <p className="mt-6 text-center font-semibold text-green-600">
          ✔ Bill already generated
        </p>
      )}
    </div>
  )
}
