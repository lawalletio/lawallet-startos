<p align="center">
  <img src="icon.png" alt="LaWallet NWC Logo" width="21%">
</p>

# LaWallet NWC on StartOS

> Everything not listed in this document should behave the same as upstream
> LaWallet NWC. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[LaWallet NWC](https://github.com/lawalletio/lawallet-nwc) is a Nostr Wallet Connect service: it custodies Nostr keys and answers wallet-connect requests on their behalf. This package runs its two halves — the web application and the payment listener — with a private PostgreSQL sidecar and generates every secret they share.

- **Upstream repo:** <https://github.com/lawalletio/lawallet-nwc>
- **Wrapper repo:** <https://github.com/Start9-Community/lawallet-startos>

The Community listing and the sideload package share this package id and the same volumes, so an install from either channel can update to the other in place. Identical trees share a revision; if this tree has drifted from the sideload tag, this listing takes the next revision.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Three images: two upstream halves of the application, and a PostgreSQL sidecar.

| Property      | Value                                                             |
| ------------- | ----------------------------------------------------------------- |
| Images        | `masize/lawallet-nwc`, `masize/lawallet-nwc-listener`, `postgres` |
| Architectures | x86_64, aarch64                                                   |
| Entrypoint    | Each image's own, via `sdk.useEntrypoint()`                       |

| Subcontainer   | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `web-sub`      | The dashboard and wallet — attach here for app logs |
| `listener-sub` | The payment listener                                |
| `postgres-sub` | The private database                                |

**The two application images move in lockstep.** They are tagged by the same upstream release, so a version bump changes both or neither.

## Volume and Data Layout

Two volumes, backed up by different mechanisms.

| Volume | Mount Point           | Purpose                                              |
| ------ | --------------------- | ---------------------------------------------------- |
| `main` | `/app/data` (subpath) | Application data, and the store at the root          |
| `db`   | `/var/lib/postgresql` | The PostgreSQL data directory (`data` is the cluster) |

The listener mounts nothing — everything it needs is in the database.

Older sideload installs kept the PostgreSQL cluster on the main volume. On update it is moved onto `db` once; a later start never sees the old path.

## File Models

One model, holding six secrets and nothing else.

| File         | Format | Modelled                | Written by |
| ------------ | ------ | ----------------------- | ---------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | Init       |

All six are **write-once**, generated at install and never regenerated:

- **The database password**, which the PostgreSQL cluster was initialized with.
- **The session signing secret**, which every issued session depends on.
- **The key vault secret**, which encrypts the custodied Nostr keys at rest.
- **The listener webhook secret**, which authenticates listener-to-web callbacks.
- **The listener request secret**, which authenticates web-to-listener calls.
- **The NWC vault secret**, which encrypts RemoteWallet and proxy NWC data.

**Regenerating any of them destroys data rather than rotating a credential** — the cluster becomes unopenable, sessions become invalid, or the custodied keys become undecryptable. So `main` fails loudly on a missing secret instead of minting a replacement, and there is deliberately no action to rotate them.

The application's own settings are its business, in the database, and are not modelled.

## Dependencies

None. PostgreSQL runs as a private sidecar of this service rather than as a StartOS dependency, and the wallet reaches Nostr relays directly.

## Network Access and Interfaces

One interface. Everything else is loopback inside the service.

| Interface | Id   | Type | Port | Description              |
| --------- | ---- | ---- | ---- | ------------------------ |
| Web UI    | `ui` | ui   | 2288 | The dashboard and wallet |

Bound on the `ui-multi` MultiHost over HTTP and not masked.

**The listener's API is deliberately not exported.** It is reachable only over container loopback, authenticated with the shared secret — it exists for the web application to call, not for anyone else, and exporting it would publish a second authenticated path into the wallet.

PostgreSQL is likewise internal, on the service's own namespace.

## Installation and First-Run Flow

Install generates the six secrets. There is no task, no credential to record, and no configuration — the user creates their account in the web interface.

Start-up is ordered: PostgreSQL first, then a oneshot fixing ownership on the application's data directory, then the web application, then the listener behind it. The web application carries a generous grace period because its first start runs database migrations.

**The listener starts last and depends on the web application**, which reflects how they work: the web application is the front door, and the listener is what keeps wallet connections answering while nobody is looking at the page.

## Actions

None. The package ships an empty action set — the application is configured entirely from its own interface.

There is deliberately no secret-rotation action, for the reason under [File Models](#file-models).

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Three checks, two of them shown.

| Check      | Displayed as       | Method                                | Grace |
| ---------- | ------------------ | ------------------------------------- | ----- |
| `web`      | "Web Interface"    | The application's health endpoint     | 60s   |
| `listener` | "Payment Listener" | The listener's health endpoint        | 30s   |
| `postgres` | — internal         | The database is accepting connections | —     |

**Both application checks query a real health endpoint** rather than probing a port, so they report that the process is serving rather than merely that something is bound.

**"Payment Listener" is the one that matters for wallet connections.** The web interface can be perfectly healthy while the listener is not, and in that state the dashboard loads and wallet-connect requests go unanswered.

A service restarting with no failing check displayed is the database; the service logs name it.

## Backups and Restore

**The database is dumped; the application volume is copied.**

An rsync of a live PostgreSQL data directory is not crash-consistent, so the database is captured as a logical dump instead — which also survives a future PostgreSQL image bump rather than being tied to the on-disk format it was taken with. **The `db` volume's files are never captured**; a restore starts the engine and replays the dump into it. A volume that is dumped is not a volume that is backed up.

**A backup made before this package's dump-based backups cannot be restored into it.** Take a new backup after updating.

**The backup contains the custodied Nostr keys, in recoverable form.** They are encrypted in the database, and the key that decrypts them is in the store on the other volume, and the backup holds both. That is what makes a restore work, and what makes the backup as sensitive as the keys.

The dump authenticates with the database password from the store, so the two halves are not independent in that direction either.

## Limitations and Differences

1. **These secrets cannot be rotated.** Each is load-bearing for existing data, so there is no action for it.
2. **The backup is equivalent to the custodied keys.** Encryption at rest protects the database file, not the backup.
3. **No configuration surface at all** — no actions, no settings, no file models beyond the secrets.
4. **The listener is internal.** Its API is loopback-only and authenticated with a shared secret.
5. **The datastore is private.** PostgreSQL is a sidecar of this service and cannot be shared or substituted.
6. **The two upstream images must stay on the same version.**

---

## Quick Reference for AI Consumers

```yaml
package_id: lawallet-nwc # note: the repo is lawallet-startos
image: masize/lawallet-nwc # plus masize/lawallet-nwc-listener and postgres
architectures:
  - x86_64
  - aarch64
subcontainers:
  - web-sub
  - listener-sub
  - postgres-sub
volumes:
  main: /app/data # app data at a subpath; store.json at the volume root
  db: /var/lib/postgresql # cluster at data/
file_models:
  - store.json # six write-once secrets
startos_managed_env_vars:
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_DB
  - DATABASE_URL
  - JWT_SECRET
  - KEY_VAULT_SECRET
  - NWC_VAULT_SECRET
  - LISTENER_URL
  - LISTENER_AUTH_SECRET
  - LISTENER_REQUEST_AUTH_SECRET
  - LISTENER_PORT
  - WEB_ORIGIN
  - NODE_ENV
  - PORT
  - HOSTNAME
dependencies: []
interfaces:
  ui: { type: ui, port: 2288 } # the listener on 4100 and postgres are internal
actions: []
tasks: []
health_checks:
  - web # displayed "Web Interface"
  - listener # displayed "Payment Listener"
  - postgres # internal
```
