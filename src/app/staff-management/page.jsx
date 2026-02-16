import { Users, UserPlus, ShieldCheck } from "lucide-react"

export default function StaffInfo() {
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
          Staff Management Guide
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-80">
          Learn how to add, manage, and monitor staff activities.
        </p>

        <div className="mt-8 flex justify-center">
          <img
            src="/images/staff.jpg"
            className="w-full max-w-xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <Users className="mx-auto text-blue-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Staff Dashboard
            </h3>
            <p className="text-sm opacity-70">
              Staff can manage daily tasks easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <UserPlus className="mx-auto text-emerald-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Add Staff
            </h3>
            <p className="text-sm opacity-70">
              Admin can create new staff accounts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border text-center">
            <ShieldCheck className="mx-auto text-purple-600 mb-3" size={36} />
            <h3 className="font-semibold text-lg mb-2">
              Role Control
            </h3>
            <p className="text-sm opacity-70">
              Assign roles and permissions.
            </p>
          </div>

        </div>
      </section>

      <section className="px-6 py-16 bg-white border-t">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            How to Manage Staff
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
            <li>Open the Staff section in the admin dashboard.</li>
            <li>Click “Add Staff”.</li>
            <li>Enter staff details and role.</li>
            <li>Create login credentials.</li>
            <li>Save to add the staff member.</li>
          </ul>
        </div>
      </section>

      {/* Staff Roles in a Pharmacy */}
<section className="px-6 py-16">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-8">
      Common Staff Roles
    </h2>

    <ul className="list-disc pl-6 space-y-3 text-md opacity-80">
      <li>Pharmacist – Dispenses medicines and checks prescriptions.</li>
      <li>Assistant – Manages stock and customer billing.</li>
      <li>Store Manager – Oversees inventory and staff performance.</li>
      <li>Admin – Manages system settings and reports.</li>
    </ul>
  </div>
</section>

{/* Daily Staff Responsibilities */}
<section className="px-6 pb-16">
  <div className="max-w-4xl mx-auto bg-emerald-50 border border-emerald-200 p-8 rounded-xl">
    <h3 className="text-2xl font-semibold mb-3">
      Daily Staff Responsibilities
    </h3>
    <ul className="list-disc pl-6 space-y-2 text-md opacity-80">
      <li>Check inventory at the start of the day.</li>
      <li>Process customer purchases.</li>
      <li>Update stock after each sale.</li>
      <li>Monitor expiry alerts.</li>
      <li>Maintain clean and organized shelves.</li>
    </ul>
  </div>
</section>


      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto bg-blue-100 border p-8 rounded-xl text-center">
          <h3 className="text-2xl font-semibold mb-3">Pro Tip</h3>
          <p className="opacity-80">
            Assign roles carefully to maintain system security.
          </p>
        </div>
      </section>

      <footer className="bg-white border-t text-center py-6 text-sm opacity-70">
        © 2026 MediStock. All rights reserved.
      </footer>
    </main>
  )
}
