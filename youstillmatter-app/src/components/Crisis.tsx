import { Phone, AlertTriangle } from "lucide-react";

export function CrisisCard() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Crisis Help">
      <div className="flex items-center gap-2 mb-2"><AlertTriangle className="text-red-600" /> <h2 className="text-lg font-bold">Crisis Help</h2></div>
      <p className="text-sm text-gray-600">If you are in crisis, call or text 988 for immediate help. This app does not provide medical advice.</p>
      <a href="tel:988" className="mt-2 bg-red-600 text-white rounded-lg px-4 py-2 inline-block">Call 988</a>
      <a href="sms:988" className="mt-2 bg-sky-500 text-white rounded-lg px-4 py-2 inline-block ml-2">Text 988</a>
    </section>
  );
}

export function EmergencyContacts() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Emergency Contacts">
      <div className="flex items-center gap-2 mb-2"><Phone className="text-sky-500" /> <h2 className="text-lg font-bold">Your Emergency Contacts</h2></div>
      <p className="text-sm text-gray-600">Add trusted contacts for quick access in a crisis.</p>
    </section>
  );
}
