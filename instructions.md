# LaWallet NWC

The first person to sign in claims the root admin role for this instance. Do it
straight away, before exposing the service to anyone else.

## Documentation

- [LaWallet NWC documentation](https://docs.lawallet.io) — the upstream guides
  for domains, lightning addresses, wallets, and BoltCards.

## What you get on StartOS

- **A Web UI** serving both the admin dashboard and the user wallet, plus the
  public endpoints that make lightning addresses and Nostr identities resolve.
- **A bundled database and payment listener.** The listener holds open the Nostr
  relay connections your NWC wallets need, so incoming payments are noticed as
  they happen. Nothing external to sign up for or configure.
- **Secrets managed for you.** The signing keys, the database password, the
  key that encrypts server-custodied Nostr keys, and the NWC vault key that
  encrypts connected wallets are generated on install and included in your
  StartOS backups.

## Getting set up

1. Start the service and open the **Web UI** from the service's Dashboard.
2. Choose **Setup now** and sign in with your Nostr key — a NIP-07 browser extension
   (Alby, nos2x), a NIP-46 remote signer, or by pasting your nsec. This claims
   the root admin role.
3. In the admin dashboard, go to **Settings → Infrastructure** and enter the
   domain you want to serve lightning addresses on. The domain onboarding wizard
   checks whether the domain reaches this instance and shows you what to change
   if it doesn't.
4. Create lightning addresses under **Addresses**, and connect a wallet under
   **Remote Wallets** to receive payments. Configure the NIP-57 receipt signer
   `nsec` in **Settings → NWC Services** if you want zap receipts; it is
   encrypted with the generated NWC vault key.

## Using LaWallet NWC

### Web interface

Opening the Web UI on a fresh instance gives you the landing page with a
**Setup now** prompt. Once you have signed in, the admin dashboard lives at
`/admin` and the user-facing wallet at `/wallet`.

### Serving lightning addresses on your domain

A lightning address only resolves if `you@yourdomain` reaches this instance.
The simplest route is to attach your domain to the Web UI interface, so the
whole service answers on it. If you would rather keep your domain pointed at an
existing site, forward these paths to the Web UI instead:

- `/.well-known/lnurlp/<username>` — LUD-16 lightning address callback
- `/.well-known/nostr.json` — NIP-05 identity
- `/.well-known/lawallet.json` — instance discovery
- `/.well-known/verify` — LUD-21 payment verification

Either way, enter the domain in **Settings → Infrastructure** so the addresses
the app hands out match.

### Payment listener

**Settings → NWC Services** and the **Listener** page in the admin dashboard
show the listener's relay connections and recent events. It runs automatically
and is already paired with the web app; you only need these pages if you are
diagnosing a wallet that has stopped reporting payments.

## Limitations

- Server-custodied Nostr keys — the ones created for passkey signups — are
  encrypted with a key generated at install and stored in your backups. If you
  lose both the server and its backups, those keys are unrecoverable and the
  affected users lose their Nostr identity. Users who export their key are
  unaffected. The same is true of connected NWC wallets: losing the NWC vault
  key makes stored connection strings unreadable.
- Upstream describes LaWallet NWC as pre-alpha software. Do not put funds you
  cannot afford to lose behind it.
