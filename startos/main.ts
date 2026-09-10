import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { listenerPort, pgDatabase, pgPort, pgUser, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   *
   * Secrets are written on install (and missing NWC/listener keys on
   * update) by init/generateSecrets.ts. A missing store.json or Postgres/JWT
   * secret is a hard error — regenerating them would mint a new database
   * password against an already-initialized cluster.
   */
  const secrets = await storeJson.read().const(effects)
  if (
    !secrets?.postgresPassword ||
    !secrets.jwtSecret ||
    !secrets.keyVaultSecret ||
    !secrets.listenerAuthSecret ||
    !secrets.listenerRequestAuthSecret ||
    !secrets.nwcVaultSecret
  ) {
    throw new Error('LaWallet NWC secrets are missing from store.json')
  }

  const databaseUrl = `postgresql://${pgUser}:${secrets.postgresPassword}@127.0.0.1:${pgPort}/${pgDatabase}`

  /**
   * ======================== Subcontainers ========================
   *
   * Postgres stays on `main` (subpath `postgresql`) so existing sideload
   * installs keep their data. Do not split onto a `db` volume without a
   * StartOS version migration.
   */
  const postgres = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'postgresql',
      mountpoint: '/var/lib/postgresql',
      readonly: false,
    }),
    'postgres-sub',
  )

  const web = sdk.SubContainer.of(
    effects,
    { imageId: 'web' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'data',
      mountpoint: '/app/data',
      readonly: false,
    }),
    'web-sub',
  )

  const listener = sdk.SubContainer.of(
    effects,
    { imageId: 'listener' },
    sdk.Mounts.of(),
    'listener-sub',
  )

  /**
   * ======================== Daemons ========================
   *
   * Postgres comes up first on loopback only. The web app then runs the
   * image's `prisma migrate deploy && node server.js`, which owns the schema
   * both it and the listener read. The listener waits for that migration to
   * land before opening its relay connections.
   */
  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgres,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: pgUser,
          POSTGRES_DB: pgDatabase,
          POSTGRES_PASSWORD: secrets.postgresPassword,
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const { exitCode } = await postgres.exec([
            'pg_isready',
            '-h',
            '127.0.0.1',
            '-U',
            pgUser,
            '-d',
            pgDatabase,
          ])
          return exitCode === 0
            ? { result: 'success', message: i18n('PostgreSQL is ready') }
            : {
                result: 'loading',
                message: i18n('Waiting for PostgreSQL to be ready'),
              }
        },
      },
      requires: [],
    })
    .addOneshot('chown-data', {
      subcontainer: web,
      exec: {
        command: ['chown', '-R', 'nextjs:nodejs', '/app/data'],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('web', {
      subcontainer: web,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          DATABASE_URL: databaseUrl,
          JWT_SECRET: secrets.jwtSecret,
          KEY_VAULT_SECRET: secrets.keyVaultSecret,
          NWC_VAULT_SECRET: secrets.nwcVaultSecret,
          LISTENER_URL: `http://127.0.0.1:${listenerPort}`,
          LISTENER_AUTH_SECRET: secrets.listenerAuthSecret,
          LISTENER_REQUEST_AUTH_SECRET: secrets.listenerRequestAuthSecret,
          NODE_ENV: 'production',
          PORT: String(uiPort),
          HOSTNAME: '0.0.0.0',
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 60000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${uiPort}/api/health`,
            {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not reachable'),
            },
          ),
      },
      requires: ['postgres', 'chown-data'],
    })
    .addDaemon('listener', {
      subcontainer: listener,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          DATABASE_URL: databaseUrl,
          LISTENER_PORT: String(listenerPort),
          LISTENER_AUTH_SECRET: secrets.listenerAuthSecret,
          LISTENER_REQUEST_AUTH_SECRET: secrets.listenerRequestAuthSecret,
          NWC_VAULT_SECRET: secrets.nwcVaultSecret,
          WEB_ORIGIN: `http://127.0.0.1:${uiPort}`,
          PROXY_RECONCILE_INTERVAL_MS: '600000',
          NODE_ENV: 'production',
        },
      },
      ready: {
        display: i18n('Payment Listener'),
        gracePeriod: 30000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${listenerPort}/health`,
            {
              successMessage: i18n('The payment listener is connected'),
              errorMessage: i18n('The payment listener is not reachable'),
            },
          ),
      },
      requires: ['web'],
    })
})
