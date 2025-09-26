#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-3}"

echo "==> Using cache-buster version: v=${VERSION}"

# Detect public dir
if [[ -d "public" ]]; then PUBLIC_DIR="public"; else PUBLIC_DIR="."; fi
echo "==> Target public directory: ${PUBLIC_DIR}"

ICON_SRC_DIR="pwa-icons"
REQUIRED=(icon-192.png icon-512.png icon-maskable.png apple-touch-icon.png favicon-32.png favicon-16.png)
for f in "${REQUIRED[@]}"; do
  [[ -f "${ICON_SRC_DIR}/${f}" ]] || { echo "Missing ${ICON_SRC_DIR}/${f}"; exit 1; }
done

mkdir -p "${PUBLIC_DIR}"
for f in "${REQUIRED[@]}"; do cp -f "${ICON_SRC_DIR}/${f}" "${PUBLIC_DIR}/${f}"; done
echo "==> Copied icons into ${PUBLIC_DIR}/"

cat > "${PUBLIC_DIR}/manifest.webmanifest" <<JSON
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
echo "==> Wrote ${PUBLIC_DIR}/manifest.webmanifest"

HEAD_SNIPPET='<!-- PWA ICONS START -->
<link rel="manifest" href="/manifest.webmanifest?v='"${VERSION}"'">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v='"${VERSION}"'" sizes="180x180">
<link rel="icon" type="image/png" href="/favicon-32.png?v='"${VERSION}"'" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16.png?v='"${VERSION}"'" sizes="16x16">
<meta name="theme-color" content="#0b1220">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<!-- PWA ICONS END -->'

if [[ -f "index.html" ]]; then
  echo "==> Patching index.html head…"
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' index.html || true
  awk -v block="$HEAD_SNIPPET" 'BEGIN{printed=0} /<\/head>/{print block; printed=1} {print} END{if(!printed) print block}' index.html > index.html.tmp
  mv index.html.tmp index.html
  echo "==> Injected tags (backup: index.html.bak)"
else
  echo "==> No index.html; paste this into your <Head>/<head>:"
  printf "\n%s\n" "$HEAD_SNIPPET"
fi

echo "==> Done. Commit & redeploy."
