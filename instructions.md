# LaWallet NWC

LaWallet NWC gives your community lightning addresses, integrated wallets, and a
Nostr identity on your own domain — running entirely on your server. This package
bundles the web app and its PostgreSQL database together, so there is nothing
external to configure.

## First run

There is **no admin password**. LaWallet NWC authenticates with **Nostr**:

1. Start the service and open the **Web UI** from the service's Dashboard.
2. Sign in with your Nostr key — a **NIP-07 browser extension** (e.g. Alby,
   nos2x) or by pasting your **nsec**.
3. The first person to sign in can **claim the root admin role**. Do this
   immediately so no one else can.
4. From the dashboard, set your domain, create lightning addresses, connect a
   remote wallet (NWC), and issue cards.

## Making it reachable on your domain

LaWallet NWC serves three public `.well-known` endpoints that your domain must
forward to this service for lightning addresses and Nostr identity to resolve:

- `/.well-known/lnurlp/<username>` — LUD-16 lightning address callback
- `/.well-known/nostr.json` — NIP-05 identity
- `/.well-known/verify` — LUD-21 verification

Point your domain at the interface StartOS exposes for this service (LAN,
`.local`, Tor, or a custom clearnet domain) and forward those paths. The
in-app onboarding wizard prints copy-paste rewrite recipes for common setups
(Cloudflare, Nginx, Caddy, Vercel, etc.).

## Backups

The StartOS backup captures the `main` volume, which holds the PostgreSQL
database, the cached Nostr profiles, and the generated secrets — a restore
brings the instance back exactly as it was.

## Notes

- The generated `JWT_SECRET` and database password are created automatically on
  first install and stored on the `main` volume. You never need to set them.
- The bundled landing screen links to `https://lawallet.io` (baked into the
  published image). Your admin dashboard and wallet work regardless.
