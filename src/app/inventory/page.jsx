import { Package, PlusCircle, Edit, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function InventoryInfo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-800">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img
            src="/images/pharmacy.jpg"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="text-2xl font-bold">MediStock</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Inventory Management Guide
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-80">
          Learn how to add, update, and manage medicines efficiently
          using the MediStock inventory system.
        </p>

        <div className="mt-8 flex justify-center">
          <img
            src="/images/inventory.jpg"
            className="w-full max-w-xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <Package className="mx-auto text-blue-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Real-time Tracking
            </h3>
            <p className="text-sm opacity-70">
              Monitor medicine stock instantly with automatic updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <CheckCircle className="mx-auto text-emerald-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Expiry Monitoring
            </h3>
            <p className="text-sm opacity-70">
              Get alerts for near-expiry and expired medicines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <PlusCircle className="mx-auto text-blue-500 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Easy Updates
            </h3>
            <p className="text-sm opacity-70">
              Quickly add, edit, or delete medicines in seconds.
            </p>
          </div>

        </div>
      </section>

      {/* Steps Section */}
      <section className="px-6 py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-12">
            How to Use Inventory
          </h2>

          <div className="space-y-8">

            <div className="flex gap-4">
              <PlusCircle className="text-blue-600 mt-1" size={28} />
              <div>
                <h3 className="font-semibold text-lg">
                  Add New Medicine
                </h3>
                <p className="text-sm opacity-80">
                  Go to the dashboard and click “Add Medicine”.
                  Enter the name, batch number, stock quantity,
                  and expiry date, then click Save.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Edit className="text-emerald-600 mt-1" size={28} />
              <div>
                <h3 className="font-semibold text-lg">
                  Update Stock
                </h3>
                <p className="text-sm opacity-80">
                  Open the inventory list, click Edit on a medicine,
                  change the details, and save the updates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Trash2 className="text-red-500 mt-1" size={28} />
              <div>
                <h3 className="font-semibold text-lg">
                  Delete Medicine
                </h3>
                <p className="text-sm opacity-80">
                  Select a medicine from the list, click Delete,
                  and confirm the action.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Daily Pharmacy Workflow */}
<section className="px-6 py-16">
  <div className="max-w-5xl mx-auto space-y-6">
    <h2 className="text-3xl font-bold text-center mb-8">
      Daily Pharmacy Inventory Workflow
    </h2>

    <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
      <li>Check new medicine deliveries and verify batch numbers.</li>
      <li>Add received medicines into the system immediately.</li>
      <li>Place medicines on shelves based on expiry date (FIFO method).</li>
      <li>Update stock after every sale.</li>
      <li>Check low-stock alerts before closing the store.</li>
      <li>Prepare a purchase list for medicines that are running low.</li>
    </ul>
  </div>
</section>

{/* Safety Guidelines */}
<section className="px-6 pb-16">
  <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 p-8 rounded-xl">
    <h3 className="text-2xl font-semibold mb-3">
      Safety Guidelines
    </h3>
    <ul className="list-disc pl-6 space-y-2 text-md opacity-80">
      <li>Always verify medicine expiry before selling.</li>
      <li>Store temperature-sensitive medicines properly.</li>
      <li>Keep high-risk medicines in secure storage.</li>
      <li>Never mix different batches in one container.</li>
    </ul>
  </div>
</section>


      {/* Tips */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-blue-100 border border-blue-200 p-8 rounded-xl text-center">
          <h3 className="text-2xl font-semibold mb-3">
            Pro Tip
          </h3>
          <p className="opacity-80">
            Update your inventory daily to prevent stock shortages
            and reduce medicine wastage.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t text-center py-6 text-sm opacity-70">
        © 2026 MediStock. All rights reserved.
      </footer>
    </main>
  )
}
