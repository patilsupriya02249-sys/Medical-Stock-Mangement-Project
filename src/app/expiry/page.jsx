import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

export default function ExpiryInfo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-800">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img src="/images/pharmacy.jpg" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-bold">MediStock</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Expiry Alerts Guide
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-80">
          Learn how to track expiry dates and manage near-expiry
          or expired medicines efficiently.
        </p>

        <div className="mt-8 flex justify-center">
          <img
            src="/images/expiry.jpg"
            className="w-full max-w-xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Expiry Alerts
            </h3>
            <p className="text-sm opacity-70">
              Get automatic alerts for medicines nearing expiry.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <Clock className="mx-auto text-blue-500 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Real-time Monitoring
            </h3>
            <p className="text-sm opacity-70">
              Track expiry dates in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <CheckCircle className="mx-auto text-emerald-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Waste Reduction
            </h3>
            <p className="text-sm opacity-70">
              Prevent losses by managing expiry properly.
            </p>
          </div>

        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            How to Use Expiry Alerts
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
            <li>Add medicines with correct expiry dates.</li>
            <li>Open the Expiry section in the dashboard.</li>
            <li>Check the list of near-expiry medicines.</li>
            <li>Remove or replace expired medicines.</li>
            <li>Take action on alerts to avoid losses.</li>
          </ul>
        </div>
      </section>

      {/* Why Expiry Management is Important */}
<section className="px-6 py-16">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-8">
      Why Expiry Management Matters
    </h2>

    <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
      <li>Expired medicines can harm patients.</li>
      <li>Helps pharmacies avoid financial losses.</li>
      <li>Maintains legal and safety compliance.</li>
      <li>Improves customer trust and reliability.</li>
    </ul>
  </div>
</section>

{/* Daily Expiry Check Routine */}
<section className="px-6 pb-16">
  <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 p-8 rounded-xl">
    <h3 className="text-2xl font-semibold mb-3">
      Daily Expiry Check Routine
    </h3>
    <ul className="list-disc pl-6 space-y-2 text-md opacity-80">
      <li>Check near-expiry alerts every morning.</li>
      <li>Move near-expiry medicines to the front shelves.</li>
      <li>Remove expired medicines immediately.</li>
      <li>Record and dispose of expired stock properly.</li>
    </ul>
  </div>
</section>


      {/* Tip */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-blue-100 border p-8 rounded-xl text-center">
          <h3 className="text-2xl font-semibold mb-3">Pro Tip</h3>
          <p className="opacity-80">
            Check expiry alerts daily to avoid selling expired medicines.
          </p>
        </div>
      </section>

      <footer className="bg-white border-t text-center py-6 text-sm opacity-70">
        © 2026 MediStock. All rights reserved.
      </footer>
    </main>
  )
}
