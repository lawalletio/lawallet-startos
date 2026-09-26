export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'PostgreSQL is ready': 0,
  'Waiting for PostgreSQL to be ready': 1,
  'Web Interface': 2,
  'The web interface is ready': 3,
  'The web interface is not reachable': 4,
  'Payment Listener': 5,
  'The payment listener is connected': 6,
  'The payment listener is not reachable': 7,

  // interfaces.ts
  'Web UI': 8,
  'The LaWallet NWC admin dashboard and wallet': 9,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
