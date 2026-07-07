import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.2.1:0',
  releaseNotes: 'LaWallet NWC 1.2.1.',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
