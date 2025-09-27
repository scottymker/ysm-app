#!/usr/bin/env bash
set -euo pipefail
V="${1:-7}"

# Choose a purple, full-bleed source. Adjust if you prefer a different file.
SRC="public/icon-512.png"
[[ -f "$SRC" ]] || SRC="pwa-icons/icon-512.png"
[[ -f "$SRC" ]] || { echo "Couldn't find $SRC. Put your purple logo at public/icon-512.png"; exit 1; }

# Create a new, versioned logo file (breaks all caches)
NEW="public/logo.v${V}.png"
cp -f "$SRC" "$NEW"

# Remove any shadowing assets Next might auto-serve
rm -f src/app/logo.png src/app/icon.png src/app/apple-icon.png 2>/dev/null || true

# Update common references in source to the versioned filename
# (plain <img>, next/image string paths, and static imports)
if command -v rg >/dev/null 2>&1; then
  FILES=$(rg -l --hidden --ignore-file .gitignore -S '/logo.png|public/logo.png' src 2>/dev/null || true)
else
  FILES=$(grep -RIl --exclude-dir=.git --exclude-dir=node_modules -E '/logo\.png|public/logo\.png' src 2>/dev/null || true)
fi

for f in $FILES; do
  sed -i.bak -e "s@/logo.png@/logo.v${V}.png@g" "$f"
  sed -i.bak -e "s@public/logo.png@public/logo.v${V}.png@g" "$f"
done

echo "New logo file: $NEW"
echo "Updated files:"
echo "$FILES"
