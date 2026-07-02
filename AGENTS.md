# AGENTS.md

StartOS service package for **LaWallet NWC** — builds a `.s9pk` that runs the
`masize/lawallet-nwc` web image alongside a bundled `postgres:15-alpine`
sidecar.

- Source of truth for the runtime is `startos/` (SDK `@start9labs/start-sdk`).
  Key files: `manifest/index.ts` (id/images/volumes), `main.ts` (postgres + web
  daemons), `interfaces.ts` (HTTP :2288), `init/generateSecrets.ts` +
  `fileModels/store.json.ts` (generated `JWT_SECRET` / DB password).
- The upstream app is <https://github.com/lawalletio/lawallet-nwc>; this repo
  only packages the published image. Version/image bumps are automated — see
  `UPDATING.md`.
- Validate with `npm run check` (tsc) and `npm run build` (ncc). Build the
  package with `make`. Full packaging guide: <https://docs.start9.com/packaging>.
- Keep `README.md` (developer/architecture) and `instructions.md` (end-user) in
  sync with any change.
