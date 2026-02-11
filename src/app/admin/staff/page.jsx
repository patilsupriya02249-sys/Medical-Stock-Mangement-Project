'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
} from 'lucide-react'

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  // ADD STAFF
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newRole, setNewRole] = useState('staff')
  const [saving, setSaving] = useState(false)

  // EDIT STAFF
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editRole, setEditRole] = useState('staff')

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setStaff(data || [])
    else alert(error.message)

    setLoading(false)
  }

  const addStaff = async () => {
    if (!newName || !newEmail) {
      alert('Name & Email required')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('staff').insert({
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
    })

    setSaving(false)

    if (!error) {
      setAddOpen(false)
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      setNewRole('staff')
      fetchStaff()
    } else alert(error.message)
  }

  const updateStaff = async (id) => {
    const { error } = await supabase
      .from('staff')
      .update({
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
      })
      .eq('id', id)

    if (!error) {
      setEditId(null)
      fetchStaff()
    } else alert(error.message)
  }

  const deleteStaff = async (id) => {
    if (!confirm('Delete this staff member?')) return
    const { error } = await supabase.from('staff').delete().eq('id', id)
    if (!error) fetchStaff()
    else alert(error.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 p-10 text-white shadow-xl">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Users /> Staff Management
          </h1>
          <p className="opacity-90 mt-1">
            Manage staff details from staff table
          </p>
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end">
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <UserPlus size={16} /> Add Staff
          </Button>
        </div>

        {/* ADD STAFF FORM */}
        {addOpen && (
          <Card className="shadow-lg">
            <CardHeader className="flex justify-between items-center">
              <span className="font-semibold text-lg">Add New Staff</span>
              <X
                className="cursor-pointer text-slate-500"
                onClick={() => setAddOpen(false)}
              />
            </CardHeader>

            <CardContent className="grid md:grid-cols-5 gap-4">
              <input className="border p-3 rounded-lg" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
              <input className="border p-3 rounded-lg" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <input className="border p-3 rounded-lg" placeholder="Phone" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
              <select className="border p-3 rounded-lg" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={addStaff} disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : 'Add'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STAFF TABLE */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="text-lg font-semibold">
            Staff List
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-slate-600 text-sm">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Joined</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {staff.map((s) => (
                      <tr
                        key={s.id}
                        className="bg-white shadow-sm rounded-xl hover:shadow-md transition"
                      >
                        <td className="px-6 py-4 rounded-l-xl">
                          {editId === s.id ? (
                            <input
                              className="border p-2 rounded w-full"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                            />
                          ) : (
                            <span className="font-medium">{s.name}</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {editId === s.id ? (
                            <input
                              className="border p-2 rounded w-full"
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                            />
                          ) : (
                            s.email
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {editId === s.id ? (
                            <input
                              className="border p-2 rounded w-full"
                              value={editPhone}
                              onChange={e => setEditPhone(e.target.value)}
                            />
                          ) : (
                            s.phone || '-'
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {editId === s.id ? (
                            <select
                              className="border p-2 rounded"
                              value={editRole}
                              onChange={e => setEditRole(e.target.value)}
                            >
                              <option value="staff">Staff</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              s.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {s.role}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(s.created_at).toDateString()}
                        </td>

                        <td className="px-6 py-4 rounded-r-xl flex justify-center gap-2">
                          {editId === s.id ? (
                            <Button size="sm" onClick={() => updateStaff(s.id)}>
                              <Save size={14} />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditId(s.id)
                                setEditName(s.name)
                                setEditEmail(s.email)
                                setEditPhone(s.phone || '')
                                setEditRole(s.role)
                              }}
                            >
                              <Pencil size={14} />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteStaff(s.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
