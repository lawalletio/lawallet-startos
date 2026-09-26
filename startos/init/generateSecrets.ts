import { sdk } from '../sdk'
import { generateSecret } from '../utils'
import { storeJson } from '../fileModels/store.json'

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

  await storeJson.merge(effects, {
    keyVaultSecret: existing.keyVaultSecret ?? generateSecret(48),
    listenerAuthSecret: existing.listenerAuthSecret ?? generateSecret(48),
    listenerRequestAuthSecret:
      existing.listenerRequestAuthSecret ?? generateSecret(48),
    nwcVaultSecret: existing.nwcVaultSecret ?? generateSecret(48),
  })
})
