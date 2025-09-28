"use client";

/**
 * Minimal iOS/Android PWA polish:
 * - When launched in standalone (added to Home Screen), set a solid background color
 *   to avoid white flash and match your brand.
 * - Uses a tiny runtime style block; no layout flicker.
 */
export default function SplashStyles() {
  const css = `
    /* Only apply when running as an installed web app */
    @media (display-mode: standalone) {
      body {
        background: #0b1220; /* brand dark background */
        color-scheme: dark;
      }
    }
    /* iOS WebKit-only features (hacky selector ensures iOS target) */
    @supports (-webkit-touch-callout: none) {
      @media (display-mode: standalone) {
        body {
          background: #0b1220;
        }
      }
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
