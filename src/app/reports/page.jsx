import { BarChart3, FileText, TrendingUp } from "lucide-react"

export default function ReportsInfo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-800">

      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img src="/images/pharmacy.jpg" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-bold">MediStock</h1>
        </div>
      </header>

      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Reports & Analytics Guide
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-80">
          Learn how to generate reports and analyze pharmacy performance.
        </p>

        <div className="mt-8 flex justify-center">
          <img
            src="/images/analytics.jpg"
            className="w-full max-w-xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <BarChart3 className="mx-auto text-blue-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Sales Reports
            </h3>
            <p className="text-sm opacity-70">
              View daily and monthly sales data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <FileText className="mx-auto text-emerald-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Stock Reports
            </h3>
            <p className="text-sm opacity-70">
              Monitor available and low-stock items.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <TrendingUp className="mx-auto text-purple-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Performance Insights
            </h3>
            <p className="text-sm opacity-70">
              Analyze trends to improve decisions.
            </p>
          </div>

        </div>
      </section>

      <section className="px-6 py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            How to Use Reports
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
            <li>Open the Reports section in the dashboard.</li>
            <li>Select the report type (sales, stock, etc.).</li>
            <li>Choose the date range.</li>
            <li>Click Generate Report.</li>
            <li>View charts and analytics.</li>
          </ul>
        </div>
      </section>

      {/* Types of Reports */}
<section className="px-6 py-16">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-8">
      Types of Reports
    </h2>

    <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
      <li>Daily sales reports.</li>
      <li>Monthly revenue reports.</li>
      <li>Low-stock medicine reports.</li>
      <li>Expired medicine reports.</li>
      <li>Staff performance reports.</li>
    </ul>
  </div>
</section>

{/* How Reports Help */}
<section className="px-6 pb-16">
  <div className="max-w-4xl mx-auto bg-purple-50 border border-purple-200 p-8 rounded-xl">
    <h3 className="text-2xl font-semibold mb-3">
      How Reports Help Your Pharmacy
    </h3>
    <ul className="list-disc pl-6 space-y-2 text-md opacity-80">
      <li>Identify fast-selling medicines.</li>
      <li>Plan future stock purchases.</li>
      <li>Track profit and expenses.</li>
      <li>Improve business decisions.</li>
    </ul>
  </div>
</section>


      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-blue-100 border p-8 rounded-xl text-center">
          <h3 className="text-2xl font-semibold mb-3">Pro Tip</h3>
          <p className="opacity-80">
            Check reports weekly to improve stock planning and sales.
          </p>
        </div>
      </section>

      <footer className="bg-white border-t text-center py-6 text-sm opacity-70">
        © 2026 MediStock. All rights reserved.
      </footer>
    </main>
  )
}
