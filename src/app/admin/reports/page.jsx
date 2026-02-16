'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AdminReportsPage() {
  const [medicines, setMedicines] = useState([])
  const [sales, setSales] = useState([])
  const [staff, setStaff] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllReports()
  }, [])

  async function fetchAllReports() {
    setLoading(true)

    const { data: medicinesData } = await supabase
      .from('medicines')
      .select('*')

    const { data: salesData } = await supabase
      .from('sales')
      .select('*')

    const { data: staffData } = await supabase
      .from('staff')
      .select('*')

    const { data: requestData } = await supabase
      .from('requests')
      .select('*')

    setMedicines(medicinesData || [])
    setSales(salesData || [])
    setStaff(staffData || [])
    setRequests(requestData || [])
    setLoading(false)
  }

  const totalSales = sales.reduce(
    (sum, s) => sum + (s.total_amount || 0),
    0
  )

  const pendingRequests = requests.filter(
    r => (r.status || '').toLowerCase() === 'pending'
  ).length

  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading full reports...
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard Reports
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Medicines"
          value={medicines.length}
          color="from-green-400 to-green-600"
        />
        <SummaryCard
          title="Total Sales"
          value={`₹${totalSales}`}
          color="from-blue-400 to-blue-600"
        />
        <SummaryCard
          title="Total Staff"
          value={staff.length}
          color="from-purple-400 to-purple-600"
        />
        <SummaryCard
          title="Pending Requests"
          value={pendingRequests}
          color="from-yellow-400 to-orange-500"
        />
      </div>

      {/* MEDICINES REPORT */}
      <ReportSection title="Medicines Report">
        <Table
          headers={[
            'Name',
            'Category',
            'Quantity',
            'Selling Price',
            'Expiry Date',
          ]}
          rows={medicines.map(m => [
            m.name || 'N/A',
            m.category || 'N/A',
            m.quantity || 0,
            <span className="font-semibold text-green-600">
              ₹{m.selling_price || 0}
            </span>,
            m.expiry_date || 'N/A',
          ])}
        />
      </ReportSection>

      {/* SALES REPORT */}
      <ReportSection title="Sales Report">
        <Table
          headers={['Bill No', 'Total Amount', 'Sold By', 'Date']}
          rows={sales.map(s => [
            s.bill_no || s.id || 'N/A',
            <span className="font-bold text-blue-600">
              ₹{s.total_amount || 0}
            </span>,
            s.staff_name || s.staff_id || 'N/A',
            s.created_at
              ? new Date(s.created_at).toLocaleDateString()
              : 'N/A',
          ])}
        />
      </ReportSection>

      {/* STAFF REPORT */}
      <ReportSection title="Staff Report">
        <Table
          headers={['Name', 'Phone', 'Role', 'Join Date']}
          rows={staff.map(st => [
            st.name || 'N/A',
            st.phone || 'N/A',
            st.role || 'N/A',
            st.join_date || 'N/A',
          ])}
        />
      </ReportSection>

      {/* REQUESTS REPORT */}
      <ReportSection title="Medicine Requests">
        <Table
          headers={[
            'Medicine',
            'Quantity',
            'Requested By',
            'Status',
            'Date',
          ]}
          rows={requests.map(r => [
            r.medicine_name || r.medicine_id || 'N/A',
            r.quantity || 0,
            r.requested_by || r.staff_id || 'N/A',
            <StatusBadge status={r.status} />,
            r.created_at
              ? new Date(r.created_at).toLocaleDateString()
              : 'N/A',
          ])}
        />
      </ReportSection>
    </div>
  )
}

/* ---------- COMPONENTS ---------- */

function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-lg bg-gradient-to-r ${color}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function ReportSection({ title, children }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function StatusBadge({ status }) {
  const value = (status || 'pending').toLowerCase()

  let style =
    'bg-yellow-100 text-yellow-700'

  if (value === 'approved')
    style = 'bg-green-100 text-green-700'
  if (value === 'rejected')
    style = 'bg-red-100 text-red-700'

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${style}`}
    >
      {value}
    </span>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-6 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}

          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50 transition">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 border-t">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
