import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.10:0',
  releaseNotes: 'Initial StartOS package for LaWallet NWC.',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
