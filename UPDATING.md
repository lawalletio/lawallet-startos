# Updating the upstream version

This package wraps [lawalletio/lawallet-nwc](https://github.com/lawalletio/lawallet-nwc),
distributed as the multi-arch image `masize/lawallet-nwc`.

## Automatic (recommended)

lawallet-nwc's `docker-publish.yml` fires a GitHub `repository_dispatch` event
(`lawallet-nwc-release`, payload `{ version, image, source_* }`) at this repo
after each image publish. `.github/workflows/update-from-upstream.yml` handles it:

1. Resolves the new `version` (and `image`, defaulting to
   `masize/lawallet-nwc:<version>`).
2. Bumps `version` in `startos/versions/current.ts` (revision reset to `:0`) and
   `dockerTag` in `startos/manifest/index.ts`.
3. Commits and pushes to `master`.

The push to `master` then triggers `tagAndRelease.yml` → `release.yml`, which
builds and publishes the `.s9pk` to the configured registry.

### Required setup on this repo

- Optional secret **`RELEASE_PAT`** — a PAT with `contents:write`. When set, the
  bump is pushed with it so `tagAndRelease.yml` fires automatically. Without it,
  the commit still lands (via `GITHUB_TOKEN`) but you must run `tagAndRelease` /
  `release` manually (GitHub does not chain workflows triggered by
  `GITHUB_TOKEN`).
- Registry/publish vars + secrets used by the shared release workflows:
  `RELEASE_REGISTRY`, `REFERENCE_REGISTRY`, `S3_S9PKS_BASE_URL`, `DEV_KEY`,
  `S3_ACCESS_KEY`, `S3_SECRET_KEY`.

### Required setup on lawallet-nwc

- Secret **`START9_APP_STORE_DISPATCH_TOKEN`** — a PAT with `contents:write` on
  this repo, so `docker-publish.yml`'s `notify-start9-app-store` job can dispatch
  here. (Mirrors `UMBREL_APP_STORE_DISPATCH_TOKEN`.)

## Manual

Trigger `update-from-upstream.yml` via **workflow_dispatch** with a `version`
(and optional `image`), or edit the two files directly:

- `startos/versions/current.ts` → `version: '<new>:0'`
- `startos/manifest/index.ts` → `dockerTag: 'masize/lawallet-nwc:<new>'`

Then `npm install && make` to build, and sideload / publish.

## Submitting to the Start9 community registry

Publishing to your own registry is handled by the release workflows above. To
list LaWallet NWC in the **public** Start9 community registry, follow
<https://docs.start9.com/packaging> (submit the built `.s9pk` per the registry's
current contribution process). This step is intentionally manual.
