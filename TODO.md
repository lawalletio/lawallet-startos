# TODO

- [ ] Sideload the built `.s9pk` onto a real StartOS box and verify: Postgres
      comes up, `prisma migrate deploy` runs, the Web UI health check passes, and
      root admin can be claimed via Nostr.
- [ ] Confirm `/app/data` (uid 1001) and `/var/lib/postgresql` volume ownership
      work on-device; add a chown oneshot only if writes fail.
- [ ] Set `RELEASE_PAT` (this repo) and `START9_APP_STORE_DISPATCH_TOKEN`
      (lawallet-nwc) so releases auto-bump end to end.
- [ ] Configure the release registry vars/secrets, or publish manually.
- [ ] Submit the `.s9pk` to the Start9 community registry.
- [ ] Optional: replace `icon.svg` (currently the LaWallet isotype) with a
      dedicated square app icon if desired.
