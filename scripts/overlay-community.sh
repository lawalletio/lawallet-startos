#!/usr/bin/env bash
# Copy the sideload package tree onto a Start9-Community checkout without
# touching their registry workflows (.github/).
set -euo pipefail

src="${1:?usage: overlay-community.sh <lawalletio-tree> <community-checkout>}"
dst="${2:?usage: overlay-community.sh <lawalletio-tree> <community-checkout>}"

if [ ! -d "$src/startos" ] || [ ! -d "$dst/.github" ]; then
  echo "overlay-community.sh: expected a lawalletio tree and a Community checkout" >&2
  exit 1
fi

rsync -a --delete "$src/startos/" "$dst/startos/"
rsync -a --delete "$src/assets/" "$dst/assets/"

cp "$src/instructions.md" "$dst/instructions.md"
cp "$src/package.json" "$dst/package.json"
cp "$src/package-lock.json" "$dst/package-lock.json"
cp "$src/Makefile" "$dst/Makefile"
cp "$src/icon.svg" "$dst/icon.svg"
cp "$src/tsconfig.json" "$dst/tsconfig.json"
cp "$src/.dockerignore" "$dst/.dockerignore"
cp "$src/.gitignore" "$dst/.gitignore"
cp "$src/LICENSE" "$dst/LICENSE"
cp "$src/CLAUDE.md" "$dst/CLAUDE.md"

cp "$src/community-overlay/README.md" "$dst/README.md"
cp "$src/community-overlay/UPDATING.md" "$dst/UPDATING.md"
