#!/usr/bin/env bash
set -euo pipefail

# --- Config / args -----------------------------------------------------------
VERSION="${1:-}"
if [[ -z "${VERSION}" ]]; then
  # Try to auto-bump from existing manifest ?v=#
  if [[ -f public/manifest.webmanifest ]]; then
    CUR=$(grep -oE '\?v=[0-9]+' public/manifest.webmanifest | head -n1 | sed 's/[^0-9]//g' || true)
    if [[ -n "${CUR}" ]]; then VERSION="$((CUR+1))"; fi
  fi
  : "${VERSION:=4}"
fi
echo "==> Using cache-buster version: v=${VERSION}"

# --- Detect public dir -------------------------------------------------------
if [[ -d "public" ]]; then PUBLIC_DIR="public"; else PUBLIC_DIR="."; fi
echo "==> Target public directory: ${PUBLIC_DIR}"

# --- Verify icon sources -----------------------------------------------------
SRC="pwa-icons"
REQ=(icon-192.png icon-512.png icon-maskable.png apple-touch-icon.png favicon-32.png favicon-16.png)
for f in "${REQ[@]}"; do
  [[ -f "${SRC}/${f}" ]] || { echo "ERROR: Missing ${SRC}/${f}"; exit 1; }
done

# --- Copy icons --------------------------------------------------------------
mkdir -p "${PUBLIC_DIR}"
for f in "${REQ[@]}"; do
  install -m 0644 "${SRC}/${f}" "${PUBLIC_DIR}/${f}"
done
echo "==> Copied icons into ${PUBLIC_DIR}/"

# --- Write manifest ----------------------------------------------------------
MANIFEST="${PUBLIC_DIR}/manifest.webmanifest"
cat > "${MANIFEST}" <<JSON
{
  "name": "YouStillMatter",
  "short_name": "YSM",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0b1220",
  "theme_color": "#0b1220",
  "icons": [
    { "src": "/icon-192.png?v=${VERSION}", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png?v=${VERSION}", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable.png?v=${VERSION}", "sizes": "1024x1024", "type": "image/png", "purpose": "maskable" }
  ]
}
JSON
echo "==> Wrote ${MANIFEST}"

# --- Common HEAD snippet -----------------------------------------------------
read -r -d '' HEAD_SNIPPET <<EOF
<!-- PWA ICONS START -->
<link rel="manifest" href="/manifest.webmanifest?v=${VERSION}">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${VERSION}" sizes="180x180">
<link rel="icon" type="image/png" href="/favicon-32.png?v=${VERSION}" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16.png?v=${VERSION}" sizes="16x16">
<meta name="theme-color" content="#0b1220">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<!-- PWA ICONS END -->
EOF

# --- Patch static index.html if present --------------------------------------
if [[ -f "index.html" ]]; then
  echo "==> Detected static site (index.html). Patching <head>…"
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' index.html || true
  awk -v block="$HEAD_SNIPPET" 'BEGIN{p=0} /<\/head>/{print block; p=1} {print} END{if(!p) print block}' index.html > index.html.tmp
  mv index.html.tmp index.html
  echo "==> Injected tags (backup: index.html.bak)"
fi

# --- Next.js: App Router (app/layout.*) --------------------------------------
LAYOUT_FILE=""
for f in app/layout.tsx app/layout.ts app/layout.jsx app/layout.js; do
  [[ -f "$f" ]] && LAYOUT_FILE="$f" && break
done

if [[ -n "$LAYOUT_FILE" ]]; then
  echo "==> Next.js App Router detected: ${LAYOUT_FILE}"
  # If file already contains a PWA block, remove it
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' "$LAYOUT_FILE" || true
  # Try to inject into a <head>...</head> block; if none, just append the snippet as a comment near top
  if grep -q "<head>" "$LAYOUT_FILE"; then
    awk -v block="$HEAD_SNIPPET" 'BEGIN{p=0} /<\/head>/{print block; p=1} {print} END{if(!p) print block}' "$LAYOUT_FILE" > "$LAYOUT_FILE.tmp"
    mv "$LAYOUT_FILE.tmp" "$LAYOUT_FILE"
    echo "==> Injected tags inside <head> of ${LAYOUT_FILE} (backup: ${LAYOUT_FILE}.bak)"
  else
    awk -v block="$HEAD_SNIPPET" 'NR==1{print block} {print}' "$LAYOUT_FILE" > "$LAYOUT_FILE.tmp"
    mv "$LAYOUT_FILE.tmp" "$LAYOUT_FILE"
    echo "==> Added PWA snippet comment at top of ${LAYOUT_FILE} (backup: ${LAYOUT_FILE}.bak)"
  fi
fi

# --- Next.js: Pages Router (_document.*) -------------------------------------
DOC_FILE=""
for f in pages/_document.tsx pages/_document.ts pages/_document.jsx pages/_document.js; do
  [[ -f "$f" ]] && DOC_FILE="$f" && break
done

if [[ -z "$DOC_FILE" && -d "pages" ]]; then
  # Create a minimal _document.tsx if missing
  DOC_FILE="pages/_document.tsx"
  cat > "$DOC_FILE" <<'TSX'
import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>{/* PWA tags injected below */}</Head>
        <body><Main /><NextScript /></body>
      </Html>
    );
  }
}
TSX
  echo "==> Created ${DOC_FILE}"
fi

if [[ -n "$DOC_FILE" ]]; then
  echo "==> Next.js Pages Router detected: ${DOC_FILE}"
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' "$DOC_FILE" || true
  # Insert before closing </Head>
  awk -v block="$HEAD_SNIPPET" 'BEGIN{p=0} /<\/Head>/{print block; p=1} {print} END{if(!p) print block}' "$DOC_FILE" > "$DOC_FILE.tmp"
  mv "$DOC_FILE.tmp" "$DOC_FILE"
  echo "==> Injected tags in ${DOC_FILE} (backup: ${DOC_FILE}.bak)"
fi

echo "==> All done. Commit & redeploy, then re-add to Home Screen on iOS to see the new icon."
