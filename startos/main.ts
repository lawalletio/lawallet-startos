import { sdk } from './sdk'
import { uiPort, pgUser, pgDatabase, pgPort, generateSecret } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   *
   * Ensure the persistent secrets exist. Normally written on install
   * (init/generateSecrets.ts); this is a safety net for any other lifecycle.
   */
  if (!(await storeJson.read().once())) {
    await storeJson.write(effects, {
      jwtSecret: generateSecret(32),
      postgresPassword: generateSecret(24),
    })
  }
  const secrets = await storeJson.read().const(effects)
  if (!secrets) {
    throw new Error('LaWallet NWC secrets are missing from store.json')
  }

  const databaseUrl = `postgresql://${pgUser}:${secrets.postgresPassword}@127.0.0.1:${pgPort}/${pgDatabase}`

  /**
   * ======================== Subcontainers ========================
   */
  const postgres = await sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'postgresql',
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres',
  )

  const web = await sdk.SubContainer.of(
    effects,
    { imageId: 'web' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'data',
      mountpoint: '/app/data',
      readonly: false,
    }),
    'web',
  )

  /**
   * ======================== Daemons ========================
   *
   * Postgres starts first (localhost only); the web app waits for it, then runs
   * the image's own startup (`prisma migrate deploy && node server.js`).
   */
  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgres,
      exec: {
        // Mirrors the postgres image entrypoint, bound to localhost only.
        command: [
          'docker-entrypoint.sh',
          'postgres',
          '-c',
          'listen_addresses=127.0.0.1',
        ],
        env: {
          POSTGRES_USER: pgUser,
          POSTGRES_DB: pgDatabase,
          POSTGRES_PASSWORD: secrets.postgresPassword,
        },
      },
      ready: {
        // Internal sidecar — hidden from the StartOS UI.
        display: null,
        fn: () =>
          sdk.healthCheck.runHealthScript(
            ['pg_isready', '-h', '127.0.0.1', '-U', pgUser, '-d', pgDatabase],
            postgres,
            {
              message: () => 'PostgreSQL is ready',
              errorMessage: 'PostgreSQL is starting',
            },
          ),
      },
      requires: [],
    })
    .addDaemon('web', {
      subcontainer: web,
      exec: {
        // Mirrors the lawallet-nwc image CMD.
        command: ['sh', '-c', 'prisma migrate deploy && node server.js'],
        env: {
          DATABASE_URL: databaseUrl,
          JWT_SECRET: secrets.jwtSecret,
          NODE_ENV: 'production',
          PORT: String(uiPort),
          HOSTNAME: '0.0.0.0',
        },
      },
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/api/health`,
            {
              successMessage: 'The LaWallet NWC web interface is ready',
              errorMessage: 'The web interface is not reachable',
            },
          ),
      },
      requires: ['postgres'],
    })
})
