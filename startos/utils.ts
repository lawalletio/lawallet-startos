// Constants and helpers shared across the package codebase.
import { utils } from '@start9labs/start-sdk'

/** Port the LaWallet NWC web server listens on (baked into the image). */
export const uiPort = 2288

/**
 * Postgres runs as a localhost-only sidecar inside this package's isolated
 * container namespace, so these credentials are never reachable off-host.
 */
export const pgUser = 'lawallet'
export const pgDatabase = 'lawallet'
export const pgPort = 5432

/** Generate a random alphanumeric secret of the given length. */
export const generateSecret = (len: number): string =>
  utils.getDefaultString({ charset: 'a-zA-Z0-9', len })
