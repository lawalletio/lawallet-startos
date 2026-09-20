import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Sideload 2.7.0:0 (and earlier) kept Postgres on `main/postgresql/data`.
 * This package uses a dedicated `db` volume (`db/data`) so Community and
 * sideload installs share one layout. Copy once, then delete the old tree
 * so a later Community listing does not see leftover sideload data.
 *
 * Fresh installs never create `main/postgresql`. If `db` already has a
 * cluster, leave both sides alone.
 */
const sideloadPgVersion = FileHelper.string({
  base: sdk.volumes.main,
  subpath: 'postgresql/data/PG_VERSION',
})

const dbPgVersion = FileHelper.string({
  base: sdk.volumes.db,
  subpath: 'data/PG_VERSION',
})

export const migrateSideloadPgdata = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'update' && kind !== 'restore') return
  if ((await sideloadPgVersion.read().once()) === null) return
  if ((await dbPgVersion.read().once()) !== null) return

  const mover = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/mnt/main',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'db',
        subpath: null,
        mountpoint: '/var/lib/postgresql',
        readonly: false,
      }),
    'pg-migrate-sub',
  )

  const copy = await mover.exec([
    'sh',
    '-c',
    'mkdir -p /var/lib/postgresql && cp -a /mnt/main/postgresql/data /var/lib/postgresql/data',
  ])
  if (copy.exitCode !== 0) {
    throw new Error(
      `Failed to move sideload PostgreSQL data onto the db volume (exit ${copy.exitCode})`,
    )
  }

  const rm = await mover.exec(['rm', '-rf', '/mnt/main/postgresql'])
  if (rm.exitCode !== 0) {
    throw new Error(
      `PostgreSQL data was copied to the db volume, but the old main/postgresql tree could not be removed (exit ${rm.exitCode})`,
    )
  }
})
