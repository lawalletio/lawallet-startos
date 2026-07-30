<p align="center">
  <img src="icon.svg" alt="LaWallet NWC Logo" width="18%">
</p>

# LaWallet NWC on StartOS

> **Upstream repo:** <https://github.com/lawalletio/lawallet-nwc>
> **Published images:** `masize/lawallet-nwc:2.1.0`,
> `masize/lawallet-nwc-listener:2.1.0`

StartOS service package for [LaWallet NWC](https://github.com/lawalletio/lawallet-nwc)
— an open-source Lightning Address platform with Nostr Wallet Connect (NIP-47).
This package runs the web app, NWC listener, and PostgreSQL database in a
single service; no external services are required.

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

| Image ID   | Image                                   | Command                                                |
| ---------- | --------------------------------------- | ------------------------------------------------------ |
| `web`      | `masize/lawallet-nwc:<version>`         | `sh -c "prisma migrate deploy && node server.js"`      |
| `listener` | `masize/lawallet-nwc-listener:<version>` | `node dist/index.js`                                   |
| `postgres` | `postgres:15-alpine`                    | `docker-entrypoint.sh postgres -c listen_addresses=…` |

Architectures: `x86_64`, `aarch64`. The web and listener images are matching
multi-arch images built by lawallet-nwc CI. Postgres and the listener are
private to the package; only the web interface is exported.

---

## Volume and Data Layout

Single `main` volume, sub-pathed per concern:

| Subpath        | Mount point              | Purpose                              |
| -------------- | ------------------------ | ------------------------------------ |
| `postgresql`   | `/var/lib/postgresql`    | PostgreSQL data directory            |
| `data`         | `/app/data`              | Cached Nostr profiles (app data dir) |
| `store.json`   | (package store)          | Generated database, JWT, listener, and NWC-vault secrets |

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

| Env var                       | Value / purpose                                                     |
| ----------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                | Shared local PostgreSQL connection                                  |
| `JWT_SECRET`                  | Generated browser/API session signing key                           |
| `KEY_VAULT_SECRET`            | Independent generated user-key encryption key                       |
| `LISTENER_URL`                | Private listener at `http://127.0.0.1:4100`                         |
| `LISTENER_AUTH_SECRET`        | Generated listener-to-web webhook HMAC key                          |
| `LISTENER_REQUEST_AUTH_SECRET` | Separate generated web-to-listener bearer key                      |
| `NWC_VAULT_SECRET`            | Encrypts RemoteWallet/proxy NWC data; shared by web and listener     |
| `PROXY_RECONCILE_INTERVAL_MS` | `600000` on listener: deferred settlement recovery every ten minutes |
| `NODE_ENV`                    | `production`                                                        |
| `PORT` / `HOSTNAME`           | `2288` / `0.0.0.0`                                                  |

Further configuration (domain, lightning addresses, remote wallets, cards,
branding) happens inside the app after signing in. When using a LaWallet
release with the deferred proxy, its NWC URI, fee, and NIP-57 receipt signer
`nsec` are entered in **Admin → Settings → NWC Services**. The `nsec` is
encrypted with `NWC_VAULT_SECRET`; it is not an environment variable.
The same vault encrypts every RemoteWallet NWC connection string. On upgrade,
web encrypts any legacy plaintext rows after `prisma migrate deploy` and before
its health check becomes ready; the listener starts only after that check.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                                |
| --------- | ---- | -------- | -------------------------------------- |
| Web UI    | 2288 | HTTP     | Admin dashboard + wallet + LUD-16 / NIP-05 |

Access via LAN IP, `<hostname>.local`, Tor `.onion`, or a custom domain. For
lightning addresses / NIP-05 to resolve publicly, forward the three
`.well-known` paths (`lnurlp`, `nostr.json`, `verify`) from your domain to this
interface — see [instructions.md](instructions.md).

---

## Health Checks

| Check         | Method                                      |
| ------------- | ------------------------------------------- |
| Web Interface | HTTP GET `http://127.0.0.1:2288/api/health` |
| NWC listener  | HTTP GET `http://127.0.0.1:4100/health`     |
| PostgreSQL    | `pg_isready`                                |

The listener and PostgreSQL checks are internal and hidden from the StartOS UI.

---

## Backups and Restore

The `main` volume is backed up in full, including the database, encrypted proxy
settings, app data, and every generated secret. Restoring it preserves access
to the saved proxy NWC connection and NIP-57 signer.

---

## Building

Requires the [StartOS SDK](https://docs.start9.com/packaging) (`start-cli`),
Node.js, and Docker.

```sh
npm install
make            # builds per-arch: lawallet-nwc_x86_64.s9pk, lawallet-nwc_aarch64.s9pk
make universal  # single universal lawallet-nwc.s9pk
make install    # sideload to a StartOS host (see ~/.startos/config.yaml)
```

---

## Updating

The web and listener image tags plus package version are bumped automatically
when lawallet-nwc publishes a new release. See [UPDATING.md](UPDATING.md) and
`.github/workflows/release.yml`.

---

## Quick Reference for AI Consumers

```yaml
package_id: lawallet-nwc
images:
  web: masize/lawallet-nwc:2.1.0
  listener: masize/lawallet-nwc-listener:2.1.0
  postgres: postgres:15-alpine
architectures: [x86_64, aarch64]
volumes:
  main:
    postgresql: /var/lib/postgresql
    data: /app/data
ports:
  ui: 2288
health: GET http://127.0.0.1:2288/api/health
startos_managed_env_vars:
  [DATABASE_URL, JWT_SECRET, KEY_VAULT_SECRET, LISTENER_URL,
   LISTENER_AUTH_SECRET, LISTENER_REQUEST_AUTH_SECRET, NWC_VAULT_SECRET,
   PROXY_RECONCILE_INTERVAL_MS, NODE_ENV, PORT, HOSTNAME]
generated_secrets:
  [JWT_SECRET, KEY_VAULT_SECRET, LISTENER_AUTH_SECRET,
   LISTENER_REQUEST_AUTH_SECRET, NWC_VAULT_SECRET, postgresPassword]
first_run: claim root admin by signing in with a Nostr key (NIP-07 / nsec)
dependencies: none
```
