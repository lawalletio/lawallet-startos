<p align="center">
  <img src="icon.svg" alt="LaWallet NWC Logo" width="18%">
</p>

# LaWallet NWC on StartOS (Community registry)

> **Upstream repo:** <https://github.com/lawalletio/lawallet-nwc>
> **Sideload wrapper:** <https://github.com/lawalletio/lawallet-startos>
> **This repo:** Community-registry listing. Builds for Marketplace → Community
> are made from here only, after a reviewed pull request.

StartOS service package for [LaWallet NWC](https://github.com/lawalletio/lawallet-nwc)
— an open-source Lightning Address platform with Nostr Wallet Connect (NIP-47).
This package runs the web app, NWC listener, and PostgreSQL database in a
single service; no external services are required.

Install from **Marketplace → Community**, or sideload the matching
`.s9pk` from [lawalletio releases](https://github.com/lawalletio/lawallet-startos/releases).
From `2.7.0:1` the two channels share `id: lawallet-nwc` and the same `main` +
`db` layout, so either can update the other in place.

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Building](#building)
- [Updating](#updating)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Image ID   | Image                                    | Command                                            |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| `web`      | `masize/lawallet-nwc:<version>`          | image entrypoint via `sdk.useEntrypoint()`         |
| `listener` | `masize/lawallet-nwc-listener:<version>` | image entrypoint via `sdk.useEntrypoint()`         |
| `postgres` | `postgres:15-alpine`                     | image entrypoint plus `listen_addresses=127.0.0.1` |

Architectures: `x86_64`, `aarch64`. The web and listener images are matching
multi-arch images built by lawallet-nwc CI. Postgres and the listener are
private to the package; only the web interface is exported.

---

## Volume and Data Layout

Two volumes (`main` + `db`):

| Volume | Subpath      | Mount point                | Purpose                                                  |
| ------ | ------------ | -------------------------- | -------------------------------------------------------- |
| `db`   | `data`       | `/var/lib/postgresql/data` | PostgreSQL cluster (backed up with `withPgDump`)         |
| `main` | `data`       | `/app/data`                | Cached Nostr profiles (app data dir)                     |
| `main` | `store.json` | (package store)            | Generated database, JWT, listener, and NWC-vault secrets |

Sideload `2.7.0:0` clusters on `main/postgresql/data` are copied to `db/data`
once on update (`startos/init/migrateSideloadPgdata.ts`).

---

## Installation and First-Run Flow

1. On **install**, the package generates independent database, JWT, listener
   webhook, listener request, and NWC-vault secrets and persists them to the
   `main` volume (`startos/init/generateSecrets.ts`).
2. On **start**, Postgres comes up first; once `pg_isready`, the web app runs
   `prisma migrate deploy` and starts. The listener waits for the web health
   check, ensuring migrations are complete before it reads shared tables.
3. There is no admin password — the operator claims the **root admin** role by
   signing in with a Nostr key (NIP-07 or nsec) via the Web UI. See
   [instructions.md](instructions.md).

---

## Configuration Management

No StartOS config form. All runtime environment is derived automatically:

| Env var                        | Value / purpose                                                      |
| ------------------------------ | -------------------------------------------------------------------- |
| `DATABASE_URL`                 | Shared local PostgreSQL connection                                   |
| `JWT_SECRET`                   | Generated browser/API session signing key                            |
| `KEY_VAULT_SECRET`             | Independent generated user-key encryption key                        |
| `LISTENER_URL`                 | Private listener at `http://127.0.0.1:4100`                          |
| `LISTENER_AUTH_SECRET`         | Generated listener-to-web webhook HMAC key                           |
| `LISTENER_REQUEST_AUTH_SECRET` | Separate generated web-to-listener bearer key                        |
| `NWC_VAULT_SECRET`             | Encrypts RemoteWallet/proxy NWC data; shared by web and listener     |
| `PROXY_RECONCILE_INTERVAL_MS`  | `600000` on listener: deferred settlement recovery every ten minutes |
| `NODE_ENV`                     | `production`                                                         |
| `PORT` / `HOSTNAME`            | `2288` / `0.0.0.0`                                                   |

Further configuration (domain, lightning addresses, remote wallets, cards,
branding) happens inside the app after signing in. When using a LaWallet
release with the deferred proxy, its NWC URI, fee, and NIP-57 receipt signer
`nsec` are entered in **Admin → Settings → NWC Services**. The `nsec` is
encrypted with `NWC_VAULT_SECRET`; it is not an environment variable.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                                    |
| --------- | ---- | -------- | ------------------------------------------ |
| Web UI    | 2288 | HTTP     | Admin dashboard + wallet + LUD-16 / NIP-05 |

Access via LAN IP, `<hostname>.local`, Tor `.onion`, or a custom domain. For
lightning addresses / NIP-05 to resolve publicly, forward the
`.well-known` paths (`lnurlp`, `nostr.json`, `lawallet.json`, `verify`) from your
domain to this interface — see [instructions.md](instructions.md).

---

## Health Checks

| Check            | Method                                      |
| ---------------- | ------------------------------------------- |
| Web Interface    | HTTP GET `http://127.0.0.1:2288/api/health` |
| Payment Listener | HTTP GET `http://127.0.0.1:4100/health`     |
| PostgreSQL       | `pg_isready` (internal)                     |

---

## Backups and Restore

Backups dump Postgres from the `db` volume (`sdk.Backups.withPgDump`) and copy
`main` (app data plus `store.json`). A sideload-era backup that still has
`main/postgresql/data` is migrated onto `db` during restore init.

---

## Building

Requires the [StartOS SDK](https://docs.start9.com/packaging) (`start-cli`),
Node.js, and Docker.

```sh
npm install
make            # builds per-arch: lawallet-nwc_x86_64.s9pk, lawallet-nwc_aarch64.s9pk
make universal  # single universal lawallet-nwc.s9pk
```

Registry releases are cut from this repo's `.github/workflows` after a merge
to `master`. Sideload `.s9pk` files are published from lawalletio.

---

## Updating

lawalletio opens a pull request against this repo after each upstream image
publish. Review and merge here — see [UPDATING.md](UPDATING.md).

---

## Quick Reference for AI Consumers

```yaml
package_id: lawallet-nwc
images:
  web: masize/lawallet-nwc (tag in startos/manifest/index.ts)
  listener: masize/lawallet-nwc-listener (tag in startos/manifest/index.ts)
  postgres: postgres:15-alpine
architectures: [x86_64, aarch64]
volumes:
  main:
    data: /app/data
    store.json: package secrets
  db:
    data: /var/lib/postgresql/data
ports:
  ui: 2288
health: GET http://127.0.0.1:2288/api/health
registry: Start9-Community (this repo)
sideload: lawalletio/lawallet-startos GitHub Releases
generated_secrets:
  [
    JWT_SECRET,
    KEY_VAULT_SECRET,
    LISTENER_AUTH_SECRET,
    LISTENER_REQUEST_AUTH_SECRET,
    NWC_VAULT_SECRET,
    postgresPassword,
  ]
first_run: claim root admin by signing in with a Nostr key (NIP-07 / nsec)
dependencies: none
```
