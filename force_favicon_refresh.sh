#!/usr/bin/env bash
set -euo pipefail
V="${1:-6}"
PUB="public"
mkdir -p "$PUB"

# 1) Make new, versioned filenames (Chrome treats new names as new resources)
cp -f "$PUB/favicon-16.png" "$PUB/favicon-16.v${V}.png"
cp -f "$PUB/favicon-32.png" "$PUB/favicon-32.v${V}.png"
cp -f "$PUB/apple-touch-icon.png" "$PUB/apple-touch-icon.v${V}.png"

# 2) Update manifest (cache-bust + icons; PWA icons unaffected by tab favicon but good hygiene)
cat > "$PUB/manifest.webmanifest" <<JSON
{
  "name": "YouStillMatter",
  "short_name": "YSM",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0b1220",
  "theme_color": "#0b1220",
  "icons": [
    { "src": "/icon-192.png?v=${V}", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png?v=${V}", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable.png?v=${V}", "sizes": "1024x1024", "type": "image/png", "purpose": "maskable" }
  ]
}
JSON

# 3) Build the <head> block we want everywhere
read -r -d '' HEAD <<EOF
<!-- PWA ICONS START -->
<link rel="manifest" href="/manifest.webmanifest?v=${V}">
<link rel="apple-touch-icon" href="/apple-touch-icon.v${V}.png" sizes="180x180">
<link rel="icon" type="image/png" href="/favicon-32.v${V}.png" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16.v${V}.png" sizes="16x16">
<link rel="shortcut icon" href="/favicon-32.v${V}.png" type="image/png">
<meta name="theme-color" content="#0b1220">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<!-- PWA ICONS END -->
EOF

# 4) Patch static index.html if present
if [[ -f "index.html" ]]; then
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' index.html || true
  awk -v block="$HEAD" 'BEGIN{p=0} /<\/head>/{print block; p=1} {print} END{if(!p) print block}' index.html > index.html.tmp
  mv index.html.tmp index.html
fi

# 5) Patch Next.js App Router (app/layout.*)
LAY=""
for f in app/layout.tsx app/layout.ts app/layout.jsx app/layout.js; do [[ -f "$f" ]] && LAY="$f" && break; done
if [[ -n "$LAY" ]]; then
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' "$LAY" || true
  if grep -q "</head>" "$LAY"; then
    awk -v block="$HEAD" 'BEGIN{p=0} /<\/head>/{print block; p=1} {print} END{if(!p) print block}' "$LAY" > "$LAY.tmp"
    mv "$LAY.tmp" "$LAY"
  else
    awk -v block="$HEAD" 'NR==1{print block} {print}' "$LAY" > "$LAY.tmp"
    mv "$LAY.tmp" "$LAY"
  fi
fi

# 6) Patch Next.js Pages Router (_document.*)
DOC=""
for f in pages/_document.tsx pages/_document.ts pages/_document.jsx pages/_document.js; do [[ -f "$f" ]] && DOC="$f" && break; done
if [[ -n "$DOC" ]]; then
  sed -i.bak -e '/<!-- PWA ICONS START -->/,/<!-- PWA ICONS END -->/d' "$DOC" || true
  awk -v block="$HEAD" 'BEGIN{p=0} /<\/Head>/{print block; p=1} {print} END{if(!p) print block}' "$DOC" > "$DOC.tmp"
  mv "$DOC.tmp" "$DOC"
fi

# 7) Optional: set short cache on favicons/manifest (Netlify)
if [[ -f "_headers" ]]; then
  # remove old section
  sed -i.bak -e '/# PWA ICON HEADERS START/,/# PWA ICON HEADERS END/d' _headers || true
else
  touch _headers
fi
cat >> _headers <<HDR

# PWA ICON HEADERS START
/manifest.webmanifest
  Cache-Control: public, max-age=60

/favicon-*.png
  Cache-Control: public, max-age=60

/apple-touch-icon*.png
  Cache-Control: public, max-age=60
# PWA ICON HEADERS END
HDR

echo "All set. Commit and deploy."
