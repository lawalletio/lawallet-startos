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

# Copying an older SDK over Community's would revert their migration. Port it here first.
sdk() { jq -r '.dependencies["@start9labs/start-sdk"]' "$1/package.json"; }
ours="$(sdk "$src")"
theirs="$(sdk "$dst")"
if [ "$(printf '%s\n%s\n' "$ours" "$theirs" | sort -V | tail -1)" != "$ours" ]; then
  echo "overlay-community.sh: Community is on start-sdk $theirs, this tree on $ours. Port their SDK change first." >&2
  exit 1
fi

rsync -a --delete "$src/startos/" "$dst/startos/"
# Registry releases are tagged on the Community repo, and promotion checks them through packageRepo.
manifest="$dst/startos/manifest/index.ts"
sed "s#packageRepo: 'https://github.com/lawalletio/lawallet-startos'#packageRepo: 'https://github.com/Start9-Community/lawallet-startos'#" "$manifest" > "$manifest.tmp"
mv "$manifest.tmp" "$manifest"
grep -q "packageRepo: 'https://github.com/Start9-Community/lawallet-startos'" "$manifest" || {
  echo "overlay-community.sh: could not set packageRepo in $manifest" >&2
  exit 1
}
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
