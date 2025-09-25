"use client";
export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 opacity-80">{error.message || "Please try again."}</p>
      <a className="mt-4 inline-block rounded-xl border px-4 py-2" href="/">Home</a>
    </main>
  );
}
