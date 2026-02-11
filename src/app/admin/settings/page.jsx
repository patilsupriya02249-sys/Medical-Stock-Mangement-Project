'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Settings,
  AlertCircle,
  Boxes,
  Bell,
  Save,
  Shield,
  Users,
  Wrench,
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    minStock: 10,
    expiryAlertDays: 30,
    allowStaffStockOut: true,
    allowStaffReports: false,
    lowStockAlert: true,
    expiryAlert: true,
    maintenanceMode: false,
    systemName: 'Medistock Management System',
  })

  const toggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const saveSettings = () => {
    // 🔜 Later connect to Supabase settings table
    console.log(settings)
    alert('System settings saved successfully')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* 🌈 HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings />
          System Settings
        </h1>
        <p className="text-sm opacity-90">
          Configure system, inventory, permissions & alerts
        </p>
      </div>

      {/* ⚙️ SETTINGS GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* SYSTEM SETTINGS */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-3">
            <Wrench className="text-indigo-600" />
            <CardTitle>System Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">System Name</label>
              <input
                className="border p-2 w-full rounded mt-1"
                value={settings.systemName}
                onChange={(e) =>
                  setSettings({ ...settings, systemName: e.target.value })
                }
              />
            </div>

            <ToggleRow
              label="Maintenance Mode"
              value={settings.maintenanceMode}
              onClick={() => toggle('maintenanceMode')}
            />
          </CardContent>
        </Card>

        {/* INVENTORY SETTINGS */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-3">
            <Boxes className="text-blue-600" />
            <CardTitle>Inventory Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <NumberRow
              label="Minimum Stock Level"
              value={settings.minStock}
              onChange={(v) =>
                setSettings({ ...settings, minStock: v })
              }
            />

            <NumberRow
              label="Expiry Alert (Days)"
              value={settings.expiryAlertDays}
              onChange={(v) =>
                setSettings({ ...settings, expiryAlertDays: v })
              }
            />
          </CardContent>
        </Card>

        {/* PERMISSIONS */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-3">
            <Shield className="text-green-600" />
            <CardTitle>Permissions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <ToggleRow
              label="Allow Staff Stock Out"
              value={settings.allowStaffStockOut}
              onClick={() => toggle('allowStaffStockOut')}
            />

            <ToggleRow
              label="Allow Staff to View Reports"
              value={settings.allowStaffReports}
              onClick={() => toggle('allowStaffReports')}
            />
          </CardContent>
        </Card>

        {/* ALERT SETTINGS */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center gap-3">
            <Bell className="text-orange-500" />
            <CardTitle>Alert Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <ToggleRow
              label="Low Stock Alerts"
              value={settings.lowStockAlert}
              onClick={() => toggle('lowStockAlert')}
            />

            <ToggleRow
              label="Expiry Alerts"
              value={settings.expiryAlert}
              onClick={() => toggle('expiryAlert')}
            />

            <div className="flex gap-2 text-slate-600">
              <AlertCircle size={16} />
              <span>
                Alerts help prevent shortages and expired medicine usage.
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 💾 SAVE */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="flex gap-2 px-6">
          <Save size={16} />
          Save All Settings
        </Button>
      </div>

    </div>
  )
}

/* ===== COMPONENTS ===== */

function ToggleRow({ label, value, onClick }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full ${
          value ? 'bg-green-500' : 'bg-slate-300'
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full transition ml-1 ${
            value ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  )
}

function NumberRow({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border p-2 w-full rounded mt-1"
      />
    </div>
  )
}
