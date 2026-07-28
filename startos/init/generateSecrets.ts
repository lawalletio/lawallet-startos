import { sdk } from '../sdk'
import { generateSecret } from '../utils'
import { storeJson } from '../fileModels/store.json'

/**
 * On first install, generate the persistent secrets the service needs: a JWT
 * signing secret, user-key vault, independent listener webhook/request
 * secrets, RemoteWallet/proxy NWC vault key, and localhost Postgres password.
 * Stored on the `main` volume (fileModels/store.json) so they stay stable
 * across restarts, updates, and restores.
 */
export const generateSecrets = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  await storeJson.write(effects, {
    jwtSecret: generateSecret(32),
    postgresPassword: generateSecret(24),
    keyVaultSecret: generateSecret(32),
    listenerAuthSecret: generateSecret(32),
    listenerRequestAuthSecret: generateSecret(32),
    nwcVaultSecret: generateSecret(32),
  })
})
