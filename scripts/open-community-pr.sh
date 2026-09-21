#!/usr/bin/env bash
# Overlay this tree onto Start9-Community/lawallet-startos master, push
# community/nwc-<version> to lawalletio, and open or update the registry PR.
set -euo pipefail

version="${1:?usage: open-community-pr.sh <upstream-version>}"
version="${version#v}"
branch="community/nwc-${version}"
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
cleanup() { rm -rf "$work"; }
trap cleanup EXIT

git clone --origin community \
  "https://github.com/Start9-Community/lawallet-startos.git" "$work"
git -C "$work" checkout -B "$branch"

"$root/scripts/overlay-community.sh" "$root" "$work"

git -C "$work" add -A
if git -C "$work" diff --cached --quiet; then
  echo "No Community overlay changes for ${version}."
else
  git -C "$work" \
    -c user.name='github-actions[bot]' \
    -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
    commit -m "Update LaWallet NWC to ${version}"
fi

if [ -n "${GH_TOKEN:-}" ]; then
  git -C "$work" remote add lawalletio \
    "https://x-access-token:${GH_TOKEN}@github.com/lawalletio/lawallet-startos.git"
else
  git -C "$work" remote add lawalletio \
    "https://github.com/lawalletio/lawallet-startos.git"
fi
git -C "$work" push -u lawalletio "HEAD:refs/heads/${branch}" --force

existing="$(
  gh pr list \
    --repo Start9-Community/lawallet-startos \
    --head "lawalletio:${branch}" \
    --state open \
    --json number \
    --jq '.[0].number // empty'
)"
if [ -n "$existing" ]; then
  echo "Updated existing Community PR #${existing}"
  gh pr view "$existing" --repo Start9-Community/lawallet-startos --json url --jq .url
  exit 0
fi

url="$(
  gh pr create \
    --repo Start9-Community/lawallet-startos \
    --base master \
    --head "lawalletio:${branch}" \
    --title "Update LaWallet NWC to ${version}" \
    --body "$(cat <<EOF
## Summary

- Overlay of [\`lawalletio/lawallet-startos\`](https://github.com/lawalletio/lawallet-startos) \`${version}\` onto this registry tree.
- Keeps this repo's \`.github/workflows\` (Community build / S3 release / sync-next). Sideload publish stays on lawalletio.
- Package layout is \`main\` + \`db\` with \`withPgDump()\`. Updating from sideload \`2.7.0:0\` moves \`main/postgresql/data\` onto \`db\` once (\`migrateSideloadPgdata\`). Six-secret contract including \`NWC_VAULT_SECRET\`.

This supersedes #3 (that branch ships \`refuseSideloadData\` instead of the migrate). Please close #3 after this lands.

Future upstream bumps will open or update a PR like this from lawalletio's Release workflow.
EOF
)"
)"
echo "$url"
