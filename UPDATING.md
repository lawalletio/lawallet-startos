# Updating & releasing

This package wraps [lawalletio/lawallet-nwc](https://github.com/lawalletio/lawallet-nwc),
distributed as the matching multi-arch images `masize/lawallet-nwc` and
`masize/lawallet-nwc-listener`.

[Start9-Community/lawallet-startos](https://github.com/Start9-Community/lawallet-startos)
is the **Community-registry** tree. Registry builds are made from that repo
only; Start9 will not pull this one. Both packages share `id: lawallet-nwc`
and the same `main` + `db` layout.

**Identical trees share a revision.** A review fix or Community-only change
that is not on the sideload tag means the registry takes the next revision.
This wrapper currently ships `2.7.1:1` on both channels after the Community
review fixes.

Older sideload installs kept Postgres on `main/postgresql/data`. Updating to
this layout copies that cluster onto `db` once.

Future auto-bumps reset the revision to `:0` and leave handwritten
`releaseNotes` in `startos/versions/current.ts` alone. After each bump this
workflow opens (or updates) a pull request against the Community fork. While
that PR has requested changes, the next bump is pushed to the same branch.

## Automatic (recommended)

lawallet-nwc's `docker-publish.yml` fires a GitHub `repository_dispatch` event
(`lawallet-nwc-release`, payload
`{ version, image, listener_image, source_* }`) at this repo
after each image publish. `.github/workflows/release.yml` then:

1. Resolves the new `version`, web image, and listener image.
2. Bumps `version` in `startos/versions/current.ts` to `{version}:0` and both
   `dockerTag` values in `startos/manifest/index.ts`; commits to `master`.
   Handwritten `releaseNotes` are left as-is.
3. Builds the universal `.s9pk` (via Start9's `setup-build-env` action).
4. Publishes it as a **GitHub Release** `v<version>` with the `.s9pk` attached.
5. Overlays this tree onto Community `master` (keeping their `.github/workflows`)
   and opens or updates a PR on `Start9-Community/lawallet-startos`.

No external registry or S3 is required for sideload — the `.s9pk` is well under
GitHub's 2 GiB release-asset limit, so it ships directly as a release download.

### Required secrets

- **This repo (`lawallet-startos`):** `DEV_KEY` — the StartOS developer signing
  key (`~/.startos/id.key.pem`, created by `start-cli init-key`; the release
  workflow also copies it to `.startos/build.key.pem`). Used to sign the `.s9pk`.
- **This repo:** `START9_COMMUNITY_PR_TOKEN` — a PAT that can push
  `community/nwc-*` branches here and open pull requests on
  `Start9-Community/lawallet-startos` (classic `public_repo`, or fine-grained
  contents-write on this repo plus PR creation on that public fork).
  `GITHUB_TOKEN` cannot open PRs on another org.
- **`lawallet-nwc`:** `START9_APP_STORE_DISPATCH_TOKEN` — a fine-grained PAT with
  **Contents: write** on this repo, so `docker-publish.yml`'s
  `notify-start9-app-store` job can dispatch here. (Mirrors
  `UMBREL_APP_STORE_DISPATCH_TOKEN`.)

## Manual release

- **Re-run the current version:** push a tag, e.g. `git tag v1.0.10 && git push origin v1.0.10`.
  Tag pushes do not rewrite `current.ts`.
- **Publish a committed one-off revision** (such as this `2.7.1:1`): run the
  **Release** workflow with `version` set to the upstream version and
  `skip_bump` checked. That rebuilds and replaces the `v<version>` `.s9pk`
  without resetting the revision to `:0`.
- **Package a specific upstream version:** run the **Release** workflow via
  _Actions → Release → Run workflow_ with a `version` and optional web/listener
  image overrides. Leave `skip_bump` off so the bot writes `{version}:0`.
- **Locally:** edit `startos/versions/current.ts` (`version: '<new>:0'`) and
  both image tags in `startos/manifest/index.ts`, then `npm install && make
universal` → `lawallet-nwc.s9pk`, and `make install` to sideload to a StartOS
  host (configure `~/.startos/config.yaml`).

## Distribution

Every release attaches `lawallet-nwc.s9pk` to a GitHub Release, e.g.
`https://github.com/lawalletio/lawallet-startos/releases/latest/download/lawallet-nwc.s9pk`
— a stable public URL users can download and **Sideload** into StartOS.

The Community marketplace listing is the default install path and is compatible
with this sideload package when the trees match. Registry bits still have to
land as a PR on `Start9-Community/lawallet-startos` — the Release workflow
opens that PR; they review and merge.

## Getting into the official Start9 Marketplace

Start9 has no automated/PR submission. Email **submissions@start9labs.com** (or
reach out via the [community channels](https://start9.com/latest/about/contact))
with a link to this repo and a short description, per Start9's
[service-pipeline](https://github.com/Start9Labs/service-pipeline) guidance. This
is a human review step and must be done by a maintainer.
