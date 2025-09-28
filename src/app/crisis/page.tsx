"use client";

import resources from "@/content/resources.json";
import { useCalmToolkitStore } from "@/stores/useCalmToolkitStore";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-4">
      <h2 className="font-medium">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function CrisisPage() {
  const { contacts } = useCalmToolkitStore();
  const hasContacts = contacts.some(c => (c.name?.trim() || c.phone?.trim()));

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Crisis</h1>

      {/* Big 988 CTA */}
      <div className="rounded-2xl border border-[color:var(--color-primary)] p-5">
        <p className="text-sm opacity-80">
          If you or someone else is in immediate danger, call <strong>911</strong>.
        </p>
        <a
          href="tel:988"
          className="mt-3 block w-full rounded-xl border bg-[color:var(--color-primary)] px-4 py-4 text-center text-white text-lg font-semibold"
        >
          Call 988 Suicide & Crisis Lifeline
        </a>
        <p className="mt-2 text-sm opacity-80">
          You can also text <strong>HOME</strong> to <a className="underline" href="sms:741741?&body=HOME">741741</a>.
        </p>
      </div>

      {/* My Calm Toolkit contacts */}
      {hasContacts && (
        <Section title="People I can text or call">
          <ul className="space-y-2">
            {contacts.map((c, i) => {
              const hasAny = (c.name?.trim() || c.phone?.trim());
              if (!hasAny) return null;
              return (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.name || "(No name)"}</div>
                    {c.phone ? <div className="text-sm opacity-70">{c.phone}</div> : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a
                      className="rounded-xl border px-3 py-2 text-sm"
                      href={c.phone ? `sms:${c.phone}` : "#"}
                      aria-disabled={!c.phone}
                      onClick={(e)=>{ if(!c.phone) e.preventDefault(); }}
                    >
                      Text
                    </a>
                    <a
                      className="rounded-xl border px-3 py-2 text-sm"
                      href={c.phone ? `tel:${c.phone}` : "#"}
                      aria-disabled={!c.phone}
                      onClick={(e)=>{ if(!c.phone) e.preventDefault(); }}
                    >
                      Call
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Resources list (from content/resources.json) */}
      <Section title="Helpful resources">
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.name} className="rounded-xl border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">
                    {r.name}{" "}
                    {r.emergency ? (
                      <span className="ml-2 rounded-full border px-2 py-0.5 text-xs text-[color:var(--color-primary)]">
                        emergency
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm opacity-80">{r.desc}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {"tel" in r && r.tel ? (
                    <a className="rounded-xl border px-3 py-2 text-sm" href={r.tel}>
                      Call
                    </a>
                  ) : null}
                  {"sms" in r && r.sms ? (
                    <a className="rounded-xl border px-3 py-2 text-sm" href={r.sms}>
                      Text
                    </a>
                  ) : null}
                  <a
                    className="rounded-xl border px-3 py-2 text-sm"
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <p className="text-xs opacity-60">
        Your Calm Toolkit and checks are saved only on this device.
      </p>
    </main>
  );
}
