"use client";

import { useState } from "react";
import { useCalmToolkitStore } from "@/stores/useCalmToolkitStore";
import { useJournalStore } from "@/stores/useJournalStore";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-4">
      <h2 className="font-medium">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function CalmToolkitPage() {
  const { contacts, activities, mantra, setContact, setActivity, setMantra, reset } =
    useCalmToolkitStore();
  const addJournal = useJournalStore((s) => s.add);

  const [copied, setCopied] = useState(false);
  const isFilled =
    contacts.some(c => c.name.trim() || c.phone.trim()) ||
    activities.some(a => a.trim()) ||
    mantra.trim().length > 0;

  function formattedText() {
    const lines: string[] = [];
    lines.push("My Calm Toolkit");
    lines.push("");
    lines.push("Three people I can text or call:");
    contacts.forEach((c, i) => lines.push(` ${i + 1}. ${c.name || "—"} ${c.phone ? `(${c.phone})` : ""}`));
    lines.push("");
    lines.push("Two grounding activities:");
    activities.forEach((a, i) => lines.push(` ${i + 1}. ${a || "—"}`));
    lines.push("");
    lines.push("One mantra / affirmation:");
    lines.push(` • ${mantra || "—"}`);
    return lines.join("\n");
  }

  async function copyToolkit() {
    try {
      await navigator.clipboard.writeText(formattedText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function saveToJournal() {
    addJournal({
      title: "My Calm Toolkit",
      body: formattedText(),
    });
    alert("Saved to Journal ✅");
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">My Calm Toolkit</h1>
      <p className="opacity-80 text-sm">
        A quick plan you can rely on. Fill it once, tweak anytime. Your info stays on this device.
      </p>

      <Section title="Three people I can text or call">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <input
              value={contacts[i]?.name || ""}
              onChange={(e) => setContact(i, { name: e.target.value, phone: contacts[i]?.phone || "" })}
              placeholder={`Name ${i + 1}`}
              className="w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
              aria-label={`Contact ${i + 1} name`}
            />
            <div className="flex gap-2">
              <input
                value={contacts[i]?.phone || ""}
                onChange={(e) => setContact(i, { name: contacts[i]?.name || "", phone: e.target.value })}
                placeholder="Phone"
                className="w-40 rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
                aria-label={`Contact ${i + 1} phone`}
                inputMode="tel"
              />
              {/* quick actions */}
              <a
                className="rounded-xl border px-3 py-2 text-sm"
                href={contacts[i]?.phone ? `sms:${contacts[i]!.phone}` : "#"}
                aria-disabled={!contacts[i]?.phone}
                onClick={(e) => { if (!contacts[i]?.phone) e.preventDefault(); }}
              >
                Text
              </a>
              <a
                className="rounded-xl border px-3 py-2 text-sm"
                href={contacts[i]?.phone ? `tel:${contacts[i]!.phone}` : "#"}
                aria-disabled={!contacts[i]?.phone}
                onClick={(e) => { if (!contacts[i]?.phone) e.preventDefault(); }}
              >
                Call
              </a>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Two grounding activities that help me reset">
        {[0, 1].map((i) => (
          <input
            key={i}
            value={activities[i] || ""}
            onChange={(e) => setActivity(i, e.target.value)}
            placeholder={i === 0 ? "e.g., 5-4-3-2-1 senses" : "e.g., slow box breathing"}
            className="w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
            aria-label={`Grounding activity ${i + 1}`}
          />
        ))}
      </Section>

      <Section title="One mantra or affirmation that reminds me I am safe">
        <input
          value={mantra}
          onChange={(e) => setMantra(e.target.value)}
          placeholder='e.g., "I am safe. This moment will pass."'
          className="w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
          aria-label="Mantra or affirmation"
        />
      </Section>

      <section className="rounded-xl border p-4">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border px-4 py-2" onClick={copyToolkit}>
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="rounded-xl border px-4 py-2" onClick={saveToJournal} disabled={!isFilled}>
            Save to Journal
          </button>
          <button className="rounded-xl border px-4 py-2" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="mt-2 text-xs opacity-60">Tip: add real names and numbers so you can act fast when stressed.</p>
      </section>
    </main>
  );
}
