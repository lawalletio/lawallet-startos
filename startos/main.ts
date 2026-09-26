import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { listenerPort, pgDatabase, pgPort, pgUser, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
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

  const postgres = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
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
