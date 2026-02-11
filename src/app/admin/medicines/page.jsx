'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Pill,
  Search,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  PackagePlus,
  IndianRupee,
} from 'lucide-react'

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [openModal, setOpenModal] = useState(false)
  const [mode, setMode] = useState('add') // add | edit
  const [form, setForm] = useState({
    id: null,
    name: '',
    selling_price: '',
    batch_no: '',
    quantity: '',
    expiry_date: '',
  })

  const [deleteMed, setDeleteMed] = useState(null)

  useEffect(() => {
    syncAndFetch()
  }, [])

  /* ================= SYNC + FETCH ================= */
  const syncAndFetch = async () => {
    setLoading(true)

    await supabase.rpc('sync_medicines_from_stock')

    const { data: meds } = await supabase
      .from('medicines')
      .select('*')
      .order('name')

    const { data: inData } = await supabase.from('stock_in').select('*')
    const { data: outData } = await supabase.from('stock_out').select('*')

    const stockMap = {}

    inData?.forEach((i) => {
      const key = i.medicine_name.toLowerCase()
      stockMap[key] = (stockMap[key] || 0) + Number(i.quantity)
    })

    outData?.forEach((o) => {
      const key = o.medicine_name.toLowerCase()
      stockMap[key] = (stockMap[key] || 0) - Number(o.quantity)
    })

    const merged = (meds || []).map((m) => ({
      ...m,
      quantity: stockMap[m.name.toLowerCase()] || 0,
    }))

    setMedicines(merged)
    setLoading(false)
  }

  /* ================= SAVE ================= */
  const saveMedicine = async () => {
    if (!form.name || !form.selling_price) {
      alert('Medicine name & selling price required')
      return
    }

    if (mode === 'edit') {
      const { error } = await supabase
        .from('medicines')
        .update({
          name: form.name.toLowerCase(),
          selling_price: Number(form.selling_price),
          expiry_date: form.expiry_date || null,
        })
        .eq('id', form.id)

      if (error) {
        alert(error.message)
        return
      }
    }

    if (mode === 'add') {
      const { error } = await supabase.from('medicines').insert([
        {
          name: form.name.toLowerCase(),
          selling_price: Number(form.selling_price),
          expiry_date: form.expiry_date || null,
        },
      ])

      if (error) {
        alert(error.message)
        return
      }
    }

    if (form.quantity && form.batch_no) {
      const { error } = await supabase.from('stock_in').insert([
        {
          medicine_name: form.name.toLowerCase(),
          batch_no: form.batch_no,
          quantity: Number(form.quantity),
          expiry: form.expiry_date || null,
        },
      ])

      if (error) {
        alert(error.message)
        return
      }
    }

    closeModal()
    syncAndFetch()
  }

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteMed) return

    await supabase.from('medicines').delete().eq('id', deleteMed.id)
    await supabase.from('stock_in').delete().eq('medicine_name', deleteMed.name)
    await supabase.from('stock_out').delete().eq('medicine_name', deleteMed.name)

    setDeleteMed(null)
    syncAndFetch()
  }

  /* ================= MODALS ================= */
  const openAdd = () => {
    setMode('add')
    setForm({
      id: null,
      name: '',
      selling_price: '',
      batch_no: '',
      quantity: '',
      expiry_date: '',
    })
    setOpenModal(true)
  }

  const openEdit = (m) => {
    setMode('edit')
    setForm({
      id: m.id,
      name: m.name,
      selling_price: m.selling_price || '',
      batch_no: '',
      quantity: '',
      expiry_date: m.expiry_date || '',
    })
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-10 text-white shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Pill size={36} /> Medicines & Stock
        </h1>
        <p className="opacity-90 mt-2">
          With selling price & live quantity
        </p>
      </div>

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-full max-w-md">
          <Search className="text-slate-400" />
          <input
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <Button onClick={openAdd} className="flex gap-2">
          <Plus size={16} /> Add Medicine
        </Button>
      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading medicines...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((m) => {
            const low = m.quantity <= 10

            const today = new Date()
            const expiry = m.expiry_date ? new Date(m.expiry_date) : null

            let expired = false
            let expiringSoon = false

            if (expiry) {
              const diffDays = (expiry - today) / (1000 * 60 * 60 * 24)
              if (diffDays < 0) expired = true
              else if (diffDays <= 30) expiringSoon = true
            }

            return (
              <Card
                key={m.id}
                className={`border-t-4 ${
                  low ? 'border-red-500' : 'border-green-500'
                }`}
              >
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-semibold text-lg capitalize">{m.name}</h3>

                  <p className="flex items-center gap-1 text-sm">
                    <IndianRupee size={14} /> {m.selling_price}
                  </p>

                  <p
                    className={`text-sm ${
                      expired
                        ? 'text-red-600'
                        : expiringSoon
                        ? 'text-orange-600'
                        : 'text-slate-500'
                    }`}
                  >
                    Expiry: {m.expiry_date || 'N/A'}
                  </p>

                  <p
                    className={`text-2xl font-bold ${
                      low ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {m.quantity}
                  </p>

                  {low && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle size={14} /> Low Stock
                    </div>
                  )}

                  {expired && (
                    <div className="flex items-center gap-1 text-xs text-red-700">
                      <AlertTriangle size={14} /> Expired
                    </div>
                  )}

                  {!expired && expiringSoon && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <AlertTriangle size={14} /> Expiring Soon
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                      <Edit3 size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteMed(m)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <Modal
          title={mode === 'add' ? 'Add Medicine' : 'Edit Medicine / Add Stock'}
          onClose={closeModal}
        >
          <Input label="Medicine Name" value={form.name}
            onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Selling Price" type="number" value={form.selling_price}
            onChange={(v) => setForm({ ...form, selling_price: v })} />
          <Input label="Batch No" value={form.batch_no}
            onChange={(v) => setForm({ ...form, batch_no: v })} />
          <Input label="Add Quantity (Stock In)" type="number" value={form.quantity}
            onChange={(v) => setForm({ ...form, quantity: v })} />
          <Input label="Expiry Date" type="date" value={form.expiry_date}
            onChange={(v) => setForm({ ...form, expiry_date: v })} />

          <Button onClick={saveMedicine} className="w-full flex gap-2">
            <PackagePlus size={16} /> Save
          </Button>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      {deleteMed && (
        <Modal title="Confirm Delete" onClose={() => setDeleteMed(null)}>
          <p className="text-sm text-slate-600">
            Delete <b>{deleteMed.name}</b> and all related stock?
          </p>
          <div className="flex gap-3">
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteMed(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ===== UI HELPERS ===== */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose}><X /></button>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange }) {
  return (
    <input
      type={type}
      placeholder={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 w-full rounded"
    />
  )
}
