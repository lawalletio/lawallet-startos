import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { pgDatabase, pgUser } from './utils'

/**
 * `db` is dumped rather than copied — an rsync of a live PGDATA is not
 * crash-consistent. `main` (app data plus store.json) is copied as-is.
 */
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: '/var/lib/postgresql',
    pgdataPath: '/data',
    database: pgDatabase,
    user: pgUser,
    password: async () => {
      const password = await storeJson.read((s) => s.postgresPassword).once()
      if (!password) {
        throw new Error('No postgres password found in store.json')
      }
      return password
    },
  }).addVolume('main'),
)
