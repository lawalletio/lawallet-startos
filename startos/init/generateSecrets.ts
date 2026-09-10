import { sdk } from '../sdk'
import { generateSecret } from '../utils'
import { storeJson } from '../fileModels/store.json'

export const generateSecrets = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.write(effects, {
      jwtSecret: generateSecret(32),
      postgresPassword: generateSecret(24),
      keyVaultSecret: generateSecret(32),
      listenerAuthSecret: generateSecret(32),
      listenerRequestAuthSecret: generateSecret(32),
      nwcVaultSecret: generateSecret(32),
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
  if (!existing.keyVaultSecret) patch.keyVaultSecret = generateSecret(32)
  if (!existing.listenerAuthSecret)
    patch.listenerAuthSecret = generateSecret(32)
  if (!existing.listenerRequestAuthSecret) {
    patch.listenerRequestAuthSecret = generateSecret(32)
  }
  if (!existing.nwcVaultSecret) patch.nwcVaultSecret = generateSecret(32)
  if (Object.keys(patch).length > 0) {
    await storeJson.write(effects, { ...existing, ...patch })
  }
})
