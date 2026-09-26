#!/usr/bin/env bash
# Overlay this tree onto Start9-Community/lawallet-startos master, push a
# lawalletio branch, and open or update the registry PR.
#
# While any lawalletio overlay PR is already open, the next bump is pushed to
# that PR's head instead of opening a sibling. A new PR is right only when
# nothing is open.
set -euo pipefail

version="${1:?usage: open-community-pr.sh <upstream-version>}"
version="${version#v}"
version="${version%%:*}"
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
cleanup() { rm -rf "$work"; }
trap cleanup EXIT

open_pr_json="$(
  gh pr list \
    --repo Start9-Community/lawallet-startos \
    --state open \
    --json number,headRefName,headRepositoryOwner \
    --jq '[.[] | select(.headRepositoryOwner.login=="lawalletio")] | first'
)"
open_number="$(printf '%s' "$open_pr_json" | jq -r '.number // empty')"
open_head="$(printf '%s' "$open_pr_json" | jq -r '.headRefName // empty')"

if [ -n "$open_head" ]; then
  branch="$open_head"
else
  branch="community/nwc-${version}"
fi

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

if [ -n "$open_number" ]; then
  echo "Updated existing Community PR #${open_number} on ${branch}"
  gh pr view "$open_number" --repo Start9-Community/lawallet-startos --json url --jq .url
  exit 0
fi

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
- Package layout is \`main\` + \`db\` with dump-based Postgres backups. Older sideload installs that kept the cluster on \`main\` are moved onto \`db\` once on update.

This supersedes #3 (that branch ships \`refuseSideloadData\` instead of the migrate). Please close #3 after this lands.

Future upstream bumps will open or update a PR like this from lawalletio's Release workflow. While a PR here has requested changes, the next bump is pushed to that branch instead of opening a sibling.
EOF
)"
)"
echo "$url"
