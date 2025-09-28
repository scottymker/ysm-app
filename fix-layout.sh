#!/usr/bin/env bash
set -euo pipefail

FILE="src/app/layout.tsx"
[ -f "$FILE" ] || { echo "Cannot find $FILE"; exit 1; }

cp "$FILE" "$FILE.bak.syntaxfix"

# 1) Remove any accidental themeColor array items left in metadata
#    (lines containing 'prefers-color-scheme' and a common trailing '],')
sed -i '/prefers-color-scheme/d' "$FILE"
sed -i '/^\s*],\s*$/d' "$FILE"

# 2) Ensure we import types (Metadata, Viewport) once
if ! grep -q 'import type .*Metadata' "$FILE"; then
  sed -i '1s|^|import type { Metadata, Viewport } from "next";\n|' "$FILE"
fi

# 3) If no viewport export exists, append a correct one
if ! grep -q 'export const viewport' "$FILE"; then
  cat >> "$FILE" <<'TS'

/** Next.js 15: themeColor must live in viewport, not metadata */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2c2ff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0f0a18" },
  ],
};
TS
fi

echo "Patched $FILE"
echo "Backup at $FILE.bak.syntaxfix"
