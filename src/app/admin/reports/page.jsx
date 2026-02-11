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
      .order('created_at', { ascending: false })

    const { data: salesData } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: staffData } = await supabase
      .from('staff')
      .select('*')
      .order('join_date', { ascending: false })

    const { data: requestData } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    setMedicines(medicinesData || [])
    setSales(salesData || [])
    setStaff(staffData || [])
    setRequests(requestData || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="p-10 text-gray-500">Loading full reports...</div>
  }

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Admin Full Reports</h1>

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
            m.name,
            m.category,
            m.quantity,
            `₹${m.selling_price}`,
            m.expiry_date,
          ])}
        />
      </ReportSection>

      {/* SALES REPORT */}
      <ReportSection title="Sales Report">
        <Table
          headers={['Bill No', 'Total Amount', 'Sold By', 'Date']}
          rows={sales.map(s => [
            s.bill_no,
            `₹${s.total_amount}`,
            s.staff_name,
            new Date(s.created_at).toLocaleDateString(),
          ])}
        />
      </ReportSection>

      {/* STAFF REPORT */}
      <ReportSection title="Staff Report">
        <Table
          headers={['Name', 'Phone', 'Role', 'Join Date']}
          rows={staff.map(st => [
            st.name,
            st.phone,
            st.role,
            st.join_date,
          ])}
        />
      </ReportSection>

      {/* REQUESTS REPORT */}
      <ReportSection title="Medicine Requests">
        <Table
          headers={['Medicine', 'Quantity', 'Requested By', 'Status', 'Date']}
          rows={requests.map(r => [
            r.medicine_name,
            r.quantity,
            r.requested_by,
            r.status,
            new Date(r.created_at).toLocaleDateString(),
          ])}
        />
      </ReportSection>
    </div>
  )
}

/* ---------- Reusable Components ---------- */

function ReportSection({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border px-3 py-2 text-left font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}

          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="border px-3 py-2">
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
