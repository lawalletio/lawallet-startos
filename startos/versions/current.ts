import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.6.0:1',
  releaseNotes:
    'LaWallet NWC 2.6.0 packaging revision: start-sdk 2.0, no secret regeneration, chown for the web data dir, and the NWC payment listener health check.',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
