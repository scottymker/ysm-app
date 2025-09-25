import data from "@/content/resources.json";

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Resources</h1>
      <p className="mt-2 opacity-80">
        Quick links and hotlines. In an emergency, call 911.
      </p>

      <ul className="mt-6 space-y-4">
        {data.map((r) => (
          <li key={r.name} className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
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
              <div className="flex shrink-0 gap-2">
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
    </main>
  );
}
