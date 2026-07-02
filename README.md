<p align="center">
  <img src="icon.svg" alt="LaWallet NWC Logo" width="18%">
</p>

# LaWallet NWC on StartOS

> **Upstream repo:** <https://github.com/lawalletio/lawallet-nwc>
> **Published image:** `masize/lawallet-nwc:1.0.10`

StartOS service package for [LaWallet NWC](https://github.com/lawalletio/lawallet-nwc)
— an open-source Lightning Address platform with Nostr Wallet Connect (NIP-47).
This package runs the web app together with its own PostgreSQL database in a
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

| Image ID   | Image                          | Command (mirrors the image)                     |
| ---------- | ------------------------------ | ----------------------------------------------- |
| `web`      | `masize/lawallet-nwc:<version>`| `sh -c "prisma migrate deploy && node server.js"` |
| `postgres` | `postgres:15-alpine`           | `docker-entrypoint.sh postgres -c listen_addresses=127.0.0.1` |

Architectures: `x86_64`, `aarch64`. The `web` image is the multi-arch image
built and published by lawallet-nwc CI. Postgres listens on `127.0.0.1` only and
is not exposed off-host.

---

## Volume and Data Layout

Single `main` volume, sub-pathed per concern:

| Subpath        | Mount point              | Purpose                              |
| -------------- | ------------------------ | ------------------------------------ |
| `postgresql`   | `/var/lib/postgresql`    | PostgreSQL data directory            |
| `data`         | `/app/data`              | Cached Nostr profiles (app data dir) |
| `store.json`   | (package store)          | Generated `JWT_SECRET` + DB password |

---

## Installation and First-Run Flow

1. On **install**, the package generates a random `JWT_SECRET` and PostgreSQL
   password and persists them to the `main` volume (`startos/init/generateSecrets.ts`).
2. On **start**, Postgres comes up first; once `pg_isready`, the web app runs
   `prisma migrate deploy` and starts.
3. There is no admin password — the operator claims the **root admin** role by
   signing in with a Nostr key (NIP-07 or nsec) via the Web UI. See
   [instructions.md](instructions.md).

---

## Configuration Management

No StartOS config form. All runtime environment is derived automatically:

| Env var        | Value                                                        |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | `postgresql://lawallet:<generated>@127.0.0.1:5432/lawallet` |
| `JWT_SECRET`   | generated on install, stored on the `main` volume           |
| `NODE_ENV`     | `production`                                                 |
| `PORT`         | `2288`                                                       |
| `HOSTNAME`     | `0.0.0.0`                                                    |

Further configuration (domain, lightning addresses, remote wallets, cards,
branding) happens inside the app after signing in.

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

| Check         | Method                                        |
| ------------- | --------------------------------------------- |
| Web Interface | HTTP GET `http://127.0.0.1:2288/api/health`   |
| PostgreSQL    | `pg_isready` (internal, hidden from UI)       |

---

## Backups and Restore

The `main` volume is backed up in full (database + app data + generated
secrets), so a restore reproduces the instance exactly.

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

The `web` image tag and package version are bumped automatically when
lawallet-nwc publishes a new release (see [UPDATING.md](UPDATING.md) and
`.github/workflows/update-from-upstream.yml`).

---

## Quick Reference for AI Consumers

```yaml
package_id: lawallet-nwc
images:
  web: masize/lawallet-nwc:1.0.10
  postgres: postgres:15-alpine
architectures: [x86_64, aarch64]
volumes:
  main:
    postgresql: /var/lib/postgresql
    data: /app/data
ports:
  ui: 2288
health: GET http://127.0.0.1:2288/api/health
startos_managed_env_vars: [DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, HOSTNAME]
generated_secrets: [JWT_SECRET, postgresPassword]   # store.json on main volume
first_run: claim root admin by signing in with a Nostr key (NIP-07 / nsec)
dependencies: none
```
