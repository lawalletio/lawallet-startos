import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/** Sideload installs kept the cluster at `main/postgresql/data`. */
const sideloadPgVersion = FileHelper.string({
  base: sdk.volumes.main,
  subpath: 'postgresql/data/PG_VERSION',
})

const dbPgVersion = FileHelper.string({
  base: sdk.volumes.db,
  subpath: 'data/PG_VERSION',
})

export const migrateSideloadPgdata = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'update') return
  if ((await sideloadPgVersion.read().once()) === null) return
  if ((await dbPgVersion.read().once()) !== null) return

  const mounts = sdk.Mounts.of()
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
    })

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    mounts,
    'pg-migrate-sub',
    async (mover) => {
      const result = await mover.exec([
        'sh',
        '-c',
        [
          'set -eu',
          'src=/mnt/main/postgresql/data',
          'dst=/var/lib/postgresql/data',
          'tmp=/var/lib/postgresql/data.migrating',
          'mkdir -p /var/lib/postgresql',
          'rm -rf "$tmp"',
          'cp -a "$src" "$tmp"',
          'if [ ! -f "$dst/PG_VERSION" ]; then rm -rf "$dst"; fi',
          'mv "$tmp" "$dst"',
          'rm -rf /mnt/main/postgresql',
        ].join('\n'),
      ])
      if (result.exitCode !== 0) {
        const stderr = String(result.stderr).trim()
        throw new Error(
          `Failed to move sideload PostgreSQL data onto the db volume (exit ${result.exitCode})${stderr ? `: ${stderr}` : ''}`,
        )
      }
    },
  )
})
