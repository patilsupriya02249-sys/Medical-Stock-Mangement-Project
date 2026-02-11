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
import { Pill, AlertTriangle, Plus, Search } from 'lucide-react'

export default function StaffMedicines() {
  const [medicines, setMedicines] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  /* DB column names stay same */
  const [form, setForm] = useState({
    name: '',
    batch_no: '',
    quantity: '',
    selling_price: '',
    expiry_date: '',
  })

  /* ================= FETCH ================= */
  const fetchMedicines = async () => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name')

    if (error) alert(error.message)
    else setMedicines(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  /* ================= FILTER ================= */
  const filtered = medicines.filter((m) =>
    ((m.name ?? '').toLowerCase().includes(search.toLowerCase())) ||
    ((m.batch_no ?? '').toLowerCase().includes(search.toLowerCase()))
  )

  /* ================= EXPIRY ================= */
  const isExpiringSoon = (date) => {
    if (!date) return false
    return (
      (new Date(date) - new Date()) / (1000 * 60 * 60 * 24) <= 30
    )
  }

  /* ================= SAVE ================= */
  const saveMedicine = async () => {
    if (
      !form.name ||
      !form.batch_no ||
      !form.quantity ||
      !form.selling_price
    ) {
      alert('Please fill all required fields')
      return
    }

    setSaving(true)

    const payload = {
      name: form.name.trim(),
      batch_no: form.batch_no.trim(),
      quantity: Number(form.quantity),
      selling_price: Number(form.selling_price),
      expiry_date: form.expiry_date || null,
    }

    let result
    if (editId) {
      result = await supabase
        .from('medicines')
        .update(payload)
        .eq('id', editId)
    } else {
      result = await supabase
        .from('medicines')
        .insert([payload])
    }

    if (result.error) {
      alert(result.error.message)
      setSaving(false)
      return
    }

    alert(editId ? 'Medicine updated ✅' : 'Medicine added ✅')

    setShowForm(false)
    setEditId(null)
    setForm({
      name: '',
      batch_no: '',
      quantity: '',
      selling_price: '',
      expiry_date: '',
    })

    setSaving(false)
    fetchMedicines()
  }

  /* ================= EDIT ================= */
  const editMedicine = (m) => {
    setEditId(m.id)
    setForm({
      name: m.name ? String(m.name) : '',
      batch_no: m.batch_no ? String(m.batch_no) : '',
      quantity: m.quantity !== null ? String(m.quantity) : '',
      selling_price:
        m.selling_price !== null ? String(m.selling_price) : '',
      expiry_date: m.expiry_date ? String(m.expiry_date) : '',
    })
    setShowForm(true)
  }

  /* ================= DELETE ================= */
  const deleteMedicine = async (id) => {
    if (!confirm('Delete this medicine?')) return
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id)

    if (error) alert(error.message)
    else fetchMedicines()
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading medicines…
      </div>
    )
  }

  return (
    <div className="p-6">

      <Card className="shadow-xl rounded-2xl">

        {/* HEADER */}
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex gap-2 items-center text-xl">
                <Pill /> Staff Medicines
              </CardTitle>
              <CardDescription className="text-blue-100">
                Manage medicine inventory
              </CardDescription>
            </div>

            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Medicine
            </Button>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-6">

          {/* SEARCH */}
          <div className="relative mb-5 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-9 py-2 border rounded-lg text-sm"
              placeholder="Search medicine or batch no"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th>Medicine</th>
                  <th>Batch No</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Selling Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((m) => {
                  const exp = isExpiringSoon(m.expiry_date)

                  return (
                    <tr
                      key={m.id}
                      className={`border-b hover:bg-slate-50 ${
                        exp ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="font-semibold">{m.name}</td>

                      <td>{m.batch_no ?? '—'}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold
                            ${
                              m.quantity <= 10
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }
                          `}
                        >
                          {m.quantity}
                        </span>
                      </td>

                      <td className="flex items-center gap-1">
                        {exp && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        {m.expiry_date ?? '—'}
                      </td>

                      <td className="font-semibold text-blue-700">
                        ₹{m.selling_price ?? '—'}
                      </td>

                      <td className="flex gap-2">
                        <Button size="sm" onClick={() => editMedicine(m)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMedicine(m.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-3">
            <h2 className="font-semibold text-lg">
              {editId ? 'Edit Medicine' : 'Add Medicine'}
            </h2>

            <input
              className="w-full border p-2 rounded-lg text-sm"
              placeholder="Medicine name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded-lg text-sm"
              placeholder="Batch No"
              value={form.batch_no}
              onChange={(e) => setForm({ ...form, batch_no: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded-lg text-sm"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded-lg text-sm"
              placeholder="Selling price"
              value={form.selling_price}
              onChange={(e) =>
                setForm({ ...form, selling_price: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2 rounded-lg text-sm"
              value={form.expiry_date}
              onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button disabled={saving} onClick={saveMedicine}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
