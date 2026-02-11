'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserCog,
  Shield,
  Search
} from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [editId, setEditId] = useState(null)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,role')

    if (!error) {
      setUsers(data || [])
    }
  }

  const updateRole = async (id) => {
    if (!role) return

    await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)

    setEditId(null)
    fetchUsers()
  }

  /* 🔍 SAFE SEARCH */
  const filteredUsers = users.filter(u =>
    ((u.email || '').toLowerCase().includes(search.toLowerCase())) ||
    ((u.role || '').toLowerCase().includes(search.toLowerCase()))
  )

  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const staffCount = users.filter(u => u.role === 'staff').length

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">

      {/* 🌈 HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users />
          Users Management
        </h1>
        <p className="text-sm opacity-90">
          Manage roles and access for system users
        </p>
      </div>

      {/* 📊 SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <Users className="text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <Shield className="text-red-600" />
            <div>
              <p className="text-sm text-slate-500">Admins</p>
              <p className="text-2xl font-bold">{adminCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <UserCog className="text-blue-500" />
            <div>
              <p className="text-sm text-slate-500">Staff</p>
              <p className="text-2xl font-bold">{staffCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔍 SEARCH BAR */}
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <Search className="text-slate-400" />
          <input
            placeholder="Search users by email or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
          />
        </CardContent>
      </Card>

      {/* 👥 USERS TABLE */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3">User Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}

                {filteredUsers.map(u => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {u.email || 'N/A'}
                    </td>

                    <td className="p-3">
                      {editId === u.id ? (
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="border p-1 rounded"
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              u.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : u.role === 'staff'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {u.role || 'user'}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {editId === u.id ? (
                        <Button size="sm" onClick={() => updateRole(u.id)}>
                          Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditId(u.id)
                            setRole(u.role || 'user')
                          }}
                        >
                          Edit Role
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
