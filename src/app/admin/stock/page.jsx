'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'
import {
  PackagePlus,
  MinusCircle,
  AlertTriangle,
} from 'lucide-react'

export default function AdminStockPage() {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)

  const [stockIn, setStockIn] = useState({
    medicine_name: '',
    batch_no: '',
    expiry: '',
    quantity: '',
  })

  const [stockOutQty, setStockOutQty] = useState({})

  /* ================= FETCH STOCK ================= */
  const fetchStock = async () => {
    setLoading(true)

    const { data: inData, error: inError } = await supabase
      .from('stock_in')
      .select('*')

    const { data: outData, error: outError } = await supabase
      .from('stock_out')
      .select('*')

    if (inError || outError) {
      console.error('FETCH ERROR', inError || outError)
      setLoading(false)
      return
    }

    const map = {}

    inData.forEach((item) => {
      const key = `${item.medicine_name.toLowerCase()}-${item.batch_no}`
      if (!map[key]) {
        map[key] = {
          medicine_name: item.medicine_name,
          batch_no: item.batch_no,
          expiry: item.expiry,
          inQty: 0,
          outQty: 0,
        }
      }
      map[key].inQty += Number(item.quantity)
    })

    outData.forEach((item) => {
      const key = `${item.medicine_name.toLowerCase()}-${item.batch_no}`
      if (map[key]) {
        map[key].outQty += Number(item.quantity)
      }
    })

    const finalStock = Object.values(map).map((i) => ({
      ...i,
      quantity: i.inQty - i.outQty,
    }))

    setStock(finalStock)
    setLoading(false)
  }

  useEffect(() => {
    fetchStock()
  }, [])

  /* ================= STOCK IN ================= */
  const addStockIn = async () => {
    if (!stockIn.medicine_name || !stockIn.batch_no || !stockIn.quantity)
      return

    const { data, error } = await supabase
      .from('stock_in')
      .insert([
        {
          medicine_name: stockIn.medicine_name.toLowerCase(),
          batch_no: stockIn.batch_no,
          expiry: stockIn.expiry || null,
          quantity: Number(stockIn.quantity),
        },
      ])
      .select('*')   // IMPORTANT

    console.log('INSERT DATA', data)
    console.log('INSERT ERROR', error)

    if (error) {
      alert(error.message || JSON.stringify(error))
      return
    }

    setStockIn({
      medicine_name: '',
      batch_no: '',
      expiry: '',
      quantity: '',
    })

    fetchStock()
  }

  /* ================= STOCK OUT ================= */
  const stockOut = async (item) => {
    const qty = Number(stockOutQty[item.batch_no])
    if (!qty || qty <= 0 || qty > item.quantity) return

    const { data, error } = await supabase
      .from('stock_out')
      .insert([
        {
          medicine_name: item.medicine_name.toLowerCase(),
          batch_no: item.batch_no,
          quantity: qty,
          reason: 'admin_usage',
        },
      ])
      .select('*')   // IMPORTANT

    console.log('STOCK OUT DATA', data)
    console.log('STOCK OUT ERROR', error)

    if (error) {
      alert(error.message || JSON.stringify(error))
      return
    }

    setStockOutQty({ ...stockOutQty, [item.batch_no]: '' })
    fetchStock()
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return <p className="p-6">Loading stock...</p>

  return (
    <div className="p-6 space-y-6">

      {/* STOCK IN */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus /> Admin Stock In
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-4 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Medicine Name"
            value={stockIn.medicine_name}
            onChange={(e) =>
              setStockIn({ ...stockIn, medicine_name: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Batch No"
            value={stockIn.batch_no}
            onChange={(e) =>
              setStockIn({ ...stockIn, batch_no: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={stockIn.expiry}
            onChange={(e) =>
              setStockIn({ ...stockIn, expiry: e.target.value })
            }
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Qty"
            value={stockIn.quantity}
            onChange={(e) =>
              setStockIn({ ...stockIn, quantity: e.target.value })
            }
          />

          <Button onClick={addStockIn} className="md:col-span-4">
            ➕ Add Stock
          </Button>
        </CardContent>
      </Card>

      {/* STOCK TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Current Stock (Admin)</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-slate-100">
              <tr>
                <th className="border p-2">Medicine</th>
                <th className="border p-2">Batch</th>
                <th className="border p-2">Expiry</th>
                <th className="border p-2">Available</th>
                <th className="border p-2">Stock Out</th>
              </tr>
            </thead>

            <tbody>
              {stock.map((s, i) => {
                const expired = s.expiry && s.expiry < today
                const low = s.quantity <= 10

                return (
                  <tr
                    key={i}
                    className={`text-center ${
                      expired
                        ? 'bg-red-200'
                        : low
                        ? 'bg-yellow-100'
                        : ''
                    }`}
                  >
                    <td className="border p-2">{s.medicine_name}</td>
                    <td className="border p-2">{s.batch_no}</td>
                    <td className="border p-2">{s.expiry || '-'}</td>
                    <td className="border p-2 font-bold">
                      {s.quantity}
                      {expired && (
                        <AlertTriangle
                          size={14}
                          className="inline ml-1 text-red-600"
                        />
                      )}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="border p-1 w-20 rounded mr-2"
                        placeholder="Qty"
                        value={stockOutQty[s.batch_no] || ''}
                        onChange={(e) =>
                          setStockOutQty({
                            ...stockOutQty,
                            [s.batch_no]: e.target.value,
                          })
                        }
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => stockOut(s)}
                      >
                        <MinusCircle size={14} />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
