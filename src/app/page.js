'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  Users,
  BarChart3,
  AlertCircle,
  Sun,
  Moon,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function Home() {
  const [dark, setDark] = useState(false)

  const pageBg = dark
    ? "bg-slate-950 text-slate-100"
    : "bg-gradient-to-br from-blue-100 via-white to-emerald-100 text-slate-900"

  const heroBg = dark
    ? "bg-slate-900"
    : "bg-gradient-to-br from-blue-300 via-blue-100 to-emerald-200"

  const sectionBg = dark
    ? "bg-slate-900"
    : "bg-gradient-to-br from-white to-blue-50"

  const card = dark
    ? "bg-slate-800 border border-slate-700"
    : "bg-white border border-slate-200 shadow"

  const footerBg = dark
    ? "bg-slate-950 text-slate-400"
    : "bg-gradient-to-r from-blue-100 to-emerald-100 text-slate-700"

  return (
    <main className={`min-h-screen transition-all duration-300 ${pageBg}`}>

      <header className={`border-b px-6 py-5 sticky top-0 z-50 backdrop-blur ${
  dark ? "bg-slate-900 border-slate-700" : "bg-white/70 border-slate-200"
}`}>
  <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

    {/* Left: Logo */}
    <div className="flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        <img src="/images/pharmacy.jpg" className="w-10 h-10 rounded-lg" />
        <span className="font-bold text-2xl">MediStock</span>
      </Link>
    </div>

    {/* Center: Navigation */}
    <nav className="hidden md:flex justify-center gap-8 text-lg font-medium">
  <Link href="/" className="hover:text-blue-600 whitespace-nowrap">
    Home
  </Link>
  <a href="#about" className="hover:text-blue-600 whitespace-nowrap">
    About
  </a>
  <a href="#features" className="hover:text-blue-600 whitespace-nowrap">
    Features
  </a>
  <a href="#how" className="hover:text-blue-600 whitespace-nowrap">
    How It Works
  </a>
  <a href="#contact" className="hover:text-blue-600 whitespace-nowrap">
    Contact
  </a>
</nav>


    {/* Right: Actions */}
    <div className="flex items-center justify-end gap-4">
      <button
        onClick={() => setDark(!dark)}
        className="p-2 rounded-lg border"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>

      <Link href="/register">
        <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
          Create Account
        </Button>
      </Link>
    </div>

  </div>
</header>

      {/* Hero */}
      <section className={`px-6 py-24 ${heroBg}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              Smart Pharmacy Stock Management
            </h1>
            <p className="text-lg mb-8 opacity-80">
              Manage medicines, track expiry dates, monitor staff activity,
              and generate reports — all in one secure system.
            </p>

            <div className="flex gap-4">
              <Link href="/login">
                <Button className="px-8 h-12 bg-blue-600 text-white">
                  Get Started
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="px-8 h-12">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <img
              src="/images/hero.jpg"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`px-6 py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="/images/about.jpg"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">
              About MediStock
            </h2>
            <p className="opacity-80 mb-4">
              MediStock is a smart pharmacy management system designed
              to simplify medicine tracking, expiry monitoring, and staff
              operations. It helps pharmacies reduce wastage, prevent
              stock shortages, and improve overall efficiency.
            </p>
            <p className="opacity-80">
              With real-time inventory updates, automated alerts, and
              powerful analytics, MediStock ensures safe and reliable
              medicine management.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`px-6 py-16 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["500+", "Medicines"],
            ["120+", "Pharmacies"],
            ["99.9%", "Accuracy"],
            ["24/7", "Monitoring"]
          ].map(([num, label], i) => (
            <div key={i} className={`${card} p-6 rounded-xl`}>
              <h3 className="text-3xl font-bold text-blue-500">{num}</h3>
              <p className="opacity-70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className={`px-6 py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Core Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Package, title: "Inventory Tracking", img: "/images/inventory.jpg", link: "/inventory" },
              { icon: AlertCircle, title: "Expiry Alerts", img: "/images/expiry.jpg", link: "/expiry" },
              { icon: Users, title: "Staff Management", img: "/images/staff.jpg", link: "/staff-management" },
              { icon: BarChart3, title: "Reports & Analytics", img: "/images/analytics.jpg", link: "/reports" }
            ].map((f, i) => (
              <Card key={i} className={`${card} overflow-hidden`}>
                <img src={f.img} className="w-full h-44 object-cover" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <f.icon size={20} className="text-blue-500" />
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={f.link}>
                    <Button className="w-full bg-blue-600 text-white">
                      Open
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className={`px-6 py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            How MediStock Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add Medicines",
                text: "Enter medicine details including batch, stock, and expiry."
              },
              {
                step: "2",
                title: "Track Inventory",
                text: "Monitor stock levels and receive low-stock alerts."
              },
              {
                step: "3",
                title: "Get Insights",
                text: "View reports and analytics to improve decisions."
              }
            ].map((item, i) => (
              <div key={i} className={`${card} p-8 rounded-xl`}>
                <div className="text-4xl font-bold text-blue-500 mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm opacity-70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`px-6 py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            What Pharmacies Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Medicals",
                text: "MediStock helped us reduce expired medicines and manage inventory easily."
              },
              {
                name: "HealthPlus Pharmacy",
                text: "The expiry alerts and reports save us hours of manual work."
              },
              {
                name: "CareWell Drugs",
                text: "Simple, fast, and very useful for daily pharmacy operations."
              }
            ].map((t, i) => (
              <div key={i} className={`${card} p-6 rounded-xl`}>
                <p className="text-sm opacity-80 mb-4">
                  “{t.text}”
                </p>
                <h4 className="font-semibold">{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`${footerBg} px-6 py-16 border-t`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/pharmacy.jpg" className="w-10 h-10 rounded-lg" />
              <span className="font-bold text-xl">MediStock</span>
            </div>
            <p className="text-sm opacity-80">
              A smart pharmacy inventory system that helps reduce waste,
              improve efficiency, and ensure patient safety.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/inventory">Inventory Management</Link></li>
              <li><Link href="/expiry">Expiry Alerts</Link></li>
              <li><Link href="/staff-management">Staff Control</Link></li>
              <li><Link href="/reports">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Dashboards</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login">User</Link></li>
              <li><Link href="/login">Staff</Link></li>
              <li><Link href="/login">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Email: support@medistock.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-sm opacity-60">
          © 2026 MediStock. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
