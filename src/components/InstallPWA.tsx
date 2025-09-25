"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InstallOutcome = "accepted" | "dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallOutcome; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function doInstall() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-medium">Install YouStillMatter</h2>
      <p className="mt-1 text-sm opacity-80">
        Install as an app for quick access and better offline support.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-xl border px-3 py-2 disabled:opacity-50"
          onClick={doInstall}
          disabled={!deferred || installed}
        >
          {installed ? "Installed" : deferred ? "Install" : "Not available"}
        </button>
        <Link className="rounded-xl border px-3 py-2" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InstallOutcome = "accepted" | "dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: InstallOutcome; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function doInstall() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-medium">Install YouStillMatter</h2>
      <p className="mt-1 text-sm opacity-80">
        Install as an app for quick access and better offline support.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-xl border px-3 py-2 disabled:opacity-50"
          onClick={doInstall}
          disabled={!deferred || installed}
        >
          {installed ? "Installed" : deferred ? "Install" : "Not available"}
        </button>
        {/* Use Next Link for internal navigation */}
        <Link className="rounded-xl border px-3 py-2" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
