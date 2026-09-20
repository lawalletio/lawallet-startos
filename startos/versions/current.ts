import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

const CHANGELOG =
  'https://github.com/lawalletio/lawallet-nwc/releases/tag/v2.7.0'

export const current = VersionInfo.of({
  version: '2.7.0:1',
  releaseNotes: {
    en_US: `LaWallet NWC 2.7.0. Sideload and Community installs now share one layout (main + db, withPgDump backups). Updating from 2.7.0:0 moves the Postgres cluster from main/postgresql/data onto the db volume once; existing admin and wallet rows stay put. Full notes: ${CHANGELOG}`,
    es_ES: `LaWallet NWC 2.7.0. Sideload y Community usan ahora el mismo layout (main + db, copias withPgDump). Actualizar desde 2.7.0:0 mueve el cluster de Postgres de main/postgresql/data al volumen db una sola vez; los datos de admin y monedero se conservan. Notas: ${CHANGELOG}`,
    de_DE: `LaWallet NWC 2.7.0. Sideload- und Community-Installationen teilen jetzt ein Layout (main + db, withPgDump-Backups). Das Update von 2.7.0:0 verschiebt den Postgres-Cluster einmalig von main/postgresql/data auf das db-Volume; Admin- und Wallet-Daten bleiben erhalten. Hinweise: ${CHANGELOG}`,
    pl_PL: `LaWallet NWC 2.7.0. Instalacje sideload i Community wspoldziela teraz jeden uklad (main + db, kopie withPgDump). Aktualizacja z 2.7.0:0 przenosi klaster Postgres z main/postgresql/data na wolumen db jeden raz; dane admina i portfela zostaja. Uwagi: ${CHANGELOG}`,
    fr_FR: `LaWallet NWC 2.7.0. Sideload et Community partagent desormais la meme disposition (main + db, sauvegardes withPgDump). La mise a jour depuis 2.7.0:0 deplace une fois le cluster Postgres de main/postgresql/data vers le volume db; les donnees admin et portefeuille restent. Notes: ${CHANGELOG}`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
