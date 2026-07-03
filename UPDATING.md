# Updating & releasing

This package wraps [lawalletio/lawallet-nwc](https://github.com/lawalletio/lawallet-nwc),
distributed as the multi-arch image `masize/lawallet-nwc`.

## Automatic (recommended)

lawallet-nwc's `docker-publish.yml` fires a GitHub `repository_dispatch` event
(`lawallet-nwc-release`, payload `{ version, image, source_* }`) at this repo
after each image publish. `.github/workflows/release.yml` handles the whole thing
in one job:

1. Resolves the new `version` (and `image`, defaulting to `masize/lawallet-nwc:<version>`).
2. Bumps `version` in `startos/versions/current.ts` (revision reset to `:0`) and
   `dockerTag` in `startos/manifest/index.ts`; commits to `master`.
3. Builds the universal `.s9pk` (via Start9's `setup-build-env` action).
4. Publishes it as a **GitHub Release** `v<version>` with the `.s9pk` attached.

No external registry or S3 is required — the `.s9pk` is well under GitHub's 2 GiB
release-asset limit, so it ships directly as a release download.

### Required secrets

- **This repo (`lawallet-startos`):** `DEV_KEY` — the StartOS developer signing
  key (`~/.startos/developer.key.pem`, created by `start-cli init-key`). Used to
  sign the `.s9pk`.
- **`lawallet-nwc`:** `START9_APP_STORE_DISPATCH_TOKEN` — a fine-grained PAT with
  **Contents: write** on this repo, so `docker-publish.yml`'s
  `notify-start9-app-store` job can dispatch here. (Mirrors
  `UMBREL_APP_STORE_DISPATCH_TOKEN`.)

## Manual release

- **Re-run the current version:** push a tag, e.g. `git tag v1.0.10 && git push origin v1.0.10`.
- **Package a specific upstream version:** run the **Release** workflow via
  *Actions → Release → Run workflow* with a `version` (and optional `image`).
- **Locally:** edit `startos/versions/current.ts` (`version: '<new>:0'`) and
  `startos/manifest/index.ts` (`dockerTag: 'masize/lawallet-nwc:<new>'`), then
  `npm install && make universal` → `lawallet-nwc.s9pk`, and `make install` to
  sideload to a StartOS host (configure `~/.startos/config.yaml`).

## Distribution

Every release attaches `lawallet-nwc.s9pk` to a GitHub Release, e.g.
`https://github.com/lawalletio/lawallet-startos/releases/latest/download/lawallet-nwc.s9pk`
— a stable public URL users can download and **Sideload** into StartOS.

## Getting into the official Start9 Marketplace

Start9 has no automated/PR submission. Email **submissions@start9labs.com** (or
reach out via the [community channels](https://start9.com/latest/about/contact))
with a link to this repo and a short description, per Start9's
[service-pipeline](https://github.com/Start9Labs/service-pipeline) guidance. This
is a human review step and must be done by a maintainer.
