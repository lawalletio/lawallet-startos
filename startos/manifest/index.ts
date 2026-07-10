import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'lawallet-nwc',
  title: 'LaWallet NWC',
  license: 'MIT',
  packageRepo: 'https://github.com/lawalletio/lawallet-startos',
  upstreamRepo: 'https://github.com/lawalletio/lawallet-nwc',
  // StartOS exposes two external-link slots on the marketplace listing:
  // marketingUrl ("Marketing") and donationUrl ("Donate"). We point them at
  // the official site and the docs — the labels themselves are fixed by StartOS.
  marketingUrl: 'https://lawallet.io',
  donationUrl: 'https://docs.lawallet.io',
  description: { short, long },
  volumes: ['main'],
  images: {
    // Published multi-arch image built + pushed by lawallet-nwc CI.
    // The `dockerTag` below is bumped automatically on each release
    // (see .github/workflows/release.yml).
    web: {
      source: { dockerTag: 'masize/lawallet-nwc:1.4.0' },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: { dockerTag: 'postgres:15-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install:
      'After installation, open the Web UI and claim the root admin role by signing in with your Nostr key (NIP-07 browser extension or nsec). Until then the instance has no administrator.',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
