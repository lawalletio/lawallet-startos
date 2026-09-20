# Updating & releasing

This package wraps [lawalletio/lawallet-nwc](https://github.com/lawalletio/lawallet-nwc),
distributed as the matching multi-arch images `masize/lawallet-nwc` and
`masize/lawallet-nwc-listener`.

[Start9-Community/lawallet-startos](https://github.com/Start9-Community/lawallet-startos)
is a **pull-mirror** of this repo after `2.7.0:1`. Both packages share
`id: lawallet-nwc` and the same `main` + `db` layout. After that revision,
`:0` (this sideload repo) and `:1` (Community registry) of the same upstream
version are interchangeable — the `:1` lane is no longer a data-layout split.

`2.7.0:1` itself is a one-off, committed on this branch: it moves a sideload
`2.7.0:0` cluster from `main/postgresql/data` onto `db/data`. Future auto-bumps
reset the revision to `:0`.

## Automatic (recommended)

lawallet-nwc's `docker-publish.yml` fires a GitHub `repository_dispatch` event
(`lawallet-nwc-release`, payload
`{ version, image, listener_image, source_* }`) at this repo
after each image publish. `.github/workflows/release.yml` handles the whole thing
in one job:

1. Resolves the new `version`, web image, and listener image.
2. Bumps `version` in `startos/versions/current.ts` to `{version}:0`, rewrites
   the five-locale `releaseNotes` object (one line plus the upstream release
   URL), and both `dockerTag` values in `startos/manifest/index.ts`; commits to
   `master`.
3. Builds the universal `.s9pk` (via Start9's `setup-build-env` action).
4. Publishes it as a **GitHub Release** `v<version>` with the `.s9pk` attached.

No external registry or S3 is required — the `.s9pk` is well under GitHub's 2 GiB
release-asset limit, so it ships directly as a release download.

### Required secrets

- **This repo (`lawallet-startos`):** `DEV_KEY` — the StartOS developer signing
  key (`~/.startos/id.key.pem`, created by `start-cli init-key`; the release
  workflow also copies it to `.startos/build.key.pem`). Used to sign the `.s9pk`.
- **`lawallet-nwc`:** `START9_APP_STORE_DISPATCH_TOKEN` — a fine-grained PAT with
  **Contents: write** on this repo, so `docker-publish.yml`'s
  `notify-start9-app-store` job can dispatch here. (Mirrors
  `UMBREL_APP_STORE_DISPATCH_TOKEN`.)

## Manual release

- **Re-run the current version:** push a tag, e.g. `git tag v1.0.10 && git push origin v1.0.10`.
- **Package a specific upstream version:** run the **Release** workflow via
  _Actions → Release → Run workflow_ with a `version` and optional web/listener
  image overrides.
- **Locally:** edit `startos/versions/current.ts` (`version: '<new>:0'`) and
  both image tags in `startos/manifest/index.ts`, then `npm install && make
universal` → `lawallet-nwc.s9pk`, and `make install` to sideload to a StartOS
  host (configure `~/.startos/config.yaml`).

## Distribution

Every release attaches `lawallet-nwc.s9pk` to a GitHub Release, e.g.
`https://github.com/lawalletio/lawallet-startos/releases/latest/download/lawallet-nwc.s9pk`
— a stable public URL users can download and **Sideload** into StartOS.

After `2.7.0:1`, the Community marketplace listing is the default install path
and is compatible with this sideload package.

## Getting into the official Start9 Marketplace

Start9 has no automated/PR submission. Email **submissions@start9labs.com** (or
reach out via the [community channels](https://start9.com/latest/about/contact))
with a link to this repo and a short description, per Start9's
[service-pipeline](https://github.com/Start9Labs/service-pipeline) guidance. This
is a human review step and must be done by a maintainer.
