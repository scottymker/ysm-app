#!/usr/bin/env bash
set -euo pipefail

# Find files in app router that reference themeColor
mapfile -t FILES < <(grep -RIl --exclude-dir=node_modules --include="*.ts*" 'themeColor' src/app || true)

if [ ${#FILES[@]} -eq 0 ]; then
  echo "No files with themeColor found under src/app."
  exit 0
fi

for f in "${FILES[@]}"; do
  echo "Patching $f"
  cp "$f" "$f.bak.viewport" || true

  # Remove any themeColor lines inside metadata blocks
  # (simple & safe: strip any line mentioning themeColor)
  sed -i '/themeColor[[:space:]]*:/d' "$f"

  # If no viewport export exists, append a standard one
  if ! grep -q 'export const viewport' "$f"; then
    cat >> "$f" <<'TSX'

/** Next.js 15: themeColor belongs in the viewport export (not metadata) */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};
TSX
  fi
done

echo "Viewport/themeColor patches applied. Backups written as *.bak.viewport"
