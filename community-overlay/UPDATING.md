# Updating

This is the **Community-registry** package. Registry builds are made from
`Start9-Community/lawallet-startos` only. Sideload `.s9pk` files are published
from [`lawalletio/lawallet-startos`](https://github.com/lawalletio/lawallet-startos).

Do not pull or rebase this repo against lawalletio. Bumps arrive as pull
requests that overlay the sideload package tree onto this `master` while
leaving `.github/workflows` (Community build, S3 release, sync-next) untouched.

## How bumps arrive

After each `lawallet-nwc` image publish, lawalletio's Release workflow:

1. Bumps and publishes the sideload `.s9pk` on lawalletio.
2. Opens or updates a PR against this repo (`community/nwc-<version>`) with
   `startos/`, `instructions.md`, image tags, and version notes.

Review the PR here, then merge. Tagging `master` runs this repo's own release
workflow onto the Community registry.

## Manual overlay (if the bot PR is late)

From a clone of this repo, with a checkout of lawalletio alongside:

```sh
../lawallet-startos/scripts/overlay-community.sh ../lawallet-startos .
```

Leave `.github/` and `AGENTS.md` as they are in this repository. Open a PR
against `master`.
