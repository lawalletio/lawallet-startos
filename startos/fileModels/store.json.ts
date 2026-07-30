import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Package-managed secrets, persisted on the `main` volume so they stay stable
 * across restarts, updates, and restores. Generated once on install
 * (see init/generateSecrets.ts) and read by main.ts.
 */
export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  z.object({
    jwtSecret: z.string(),
    postgresPassword: z.string(),
    // Optional so backups created before the listener was bundled still load.
    // main.ts generates and persists any missing value before starting daemons.
    keyVaultSecret: z.string().optional(),
    listenerAuthSecret: z.string().optional(),
    listenerRequestAuthSecret: z.string().optional(),
    nwcVaultSecret: z.string().optional(),
  }),
)
