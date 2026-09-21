import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'lawallet-nwc',
  title: 'LaWallet NWC',
  license: 'MIT',
  packageRepo: 'https://github.com/lawalletio/lawallet-startos',
  upstreamRepo: 'https://github.com/lawalletio/lawallet-nwc',
  marketingUrl: 'https://lawallet.io',
  donationUrl: 'https://docs.lawallet.io',
  description: { short, long },
  volumes: ['main', 'db'],
  images: {
    web: {
      source: { dockerTag: 'masize/lawallet-nwc:2.7.1' },
      arch: ['x86_64', 'aarch64'],
    },
    listener: {
      source: { dockerTag: 'masize/lawallet-nwc-listener:2.7.1' },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: { dockerTag: 'postgres:15-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
