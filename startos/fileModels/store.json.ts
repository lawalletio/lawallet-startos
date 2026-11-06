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
    // Optional for compatibility with backups created before the listener and
    // deferred proxy were bundled. main.ts fills them once and persists them.
    listenerAuthSecret: z.string().optional(),
    nwcVaultSecret: z.string().optional(),
  }),
)
