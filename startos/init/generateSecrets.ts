import { sdk } from '../sdk'
import { generateSecret } from '../utils'
import { storeJson } from '../fileModels/store.json'

// Each secret is load-bearing for data already on disk, so none is ever regenerated.
export const generateSecrets = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.write(effects, {
      jwtSecret: generateSecret(48),
      postgresPassword: generateSecret(24),
      keyVaultSecret: generateSecret(48),
      listenerAuthSecret: generateSecret(48),
      listenerRequestAuthSecret: generateSecret(48),
      nwcVaultSecret: generateSecret(48),
    })
    return
  }

  const existing = await storeJson.read().once()
  if (!existing) return

  const patch: {
    keyVaultSecret?: string
    listenerAuthSecret?: string
    listenerRequestAuthSecret?: string
    nwcVaultSecret?: string
  } = {}
  if (!existing.keyVaultSecret) patch.keyVaultSecret = generateSecret(48)
  if (!existing.listenerAuthSecret) {
    patch.listenerAuthSecret = generateSecret(48)
  }
  if (!existing.listenerRequestAuthSecret) {
    patch.listenerRequestAuthSecret = generateSecret(48)
  }
  if (!existing.nwcVaultSecret) patch.nwcVaultSecret = generateSecret(48)
  if (Object.keys(patch).length > 0) {
    await storeJson.write(effects, { ...existing, ...patch })
  }
})
