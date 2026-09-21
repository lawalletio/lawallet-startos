import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.0'

export const current = VersionInfo.of({
  version: '2.7.1:0',
  releaseNotes: {
    en_US: 'LaWallet NWC 2.7.1. https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.1',
    es_ES: 'LaWallet NWC 2.7.1. https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.1',
    de_DE: 'LaWallet NWC 2.7.1. https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.1',
    pl_PL: 'LaWallet NWC 2.7.1. https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.1',
    fr_FR: 'LaWallet NWC 2.7.1. https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.1',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
