import { sdk } from './sdk'
import {
  uiPort,
  listenerPort,
  pgUser,
  pgDatabase,
  pgPort,
  generateSecret,
} from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   *
   * Ensure the persistent secrets exist. Normally written on install
   * (init/generateSecrets.ts); this is a safety net for any other lifecycle.
   */
  const storedSecrets = await storeJson.read().once()
  if (!storedSecrets) {
    await storeJson.write(effects, {
      jwtSecret: generateSecret(32),
      postgresPassword: generateSecret(24),
      keyVaultSecret: generateSecret(32),
      listenerAuthSecret: generateSecret(32),
      listenerRequestAuthSecret: generateSecret(32),
      nwcVaultSecret: generateSecret(32),
    })
  } else if (
    !storedSecrets.keyVaultSecret ||
    !storedSecrets.listenerAuthSecret ||
    !storedSecrets.listenerRequestAuthSecret ||
    !storedSecrets.nwcVaultSecret
  ) {
    // Upgrade path for backups/installations created before the listener and
    // deferred proxy were bundled. Existing secrets remain unchanged.
    await storeJson.write(effects, {
      ...storedSecrets,
      keyVaultSecret: storedSecrets.keyVaultSecret || generateSecret(32),
      listenerAuthSecret:
        storedSecrets.listenerAuthSecret || generateSecret(32),
      listenerRequestAuthSecret:
        storedSecrets.listenerRequestAuthSecret || generateSecret(32),
      nwcVaultSecret: storedSecrets.nwcVaultSecret || generateSecret(32),
    })
  }
  const secrets = await storeJson.read().const(effects)
  if (
    !secrets ||
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

  const listener = await sdk.SubContainer.of(
    effects,
    { imageId: 'listener' },
    sdk.Mounts.of(),
    'listener',
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
    .addDaemon('listener', {
      subcontainer: listener,
      exec: {
        // Mirrors the listener image CMD.
        command: ['node', 'dist/index.js'],
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
        // Internal sidecar — hidden from the StartOS UI.
        display: null,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${listenerPort}/health`,
            {
              successMessage: 'The NWC listener is ready',
              errorMessage: 'The NWC listener is starting',
            },
          ),
      },
      // Waiting for web guarantees Prisma migrations complete before the
      // listener reads the shared tables.
      requires: ['postgres', 'web'],
    })
})
