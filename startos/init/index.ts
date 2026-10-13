import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { migrateSideloadPgdata } from './migrateSideloadPgdata'
import { generateSecrets } from './generateSecrets'

export const init = sdk.setupInit(
  restoreInit,
  migrateSideloadPgdata,
  versionGraph,
  setInterfaces,
  actions,
  dependencies,
  generateSecrets,
)

export const uninit = sdk.setupUninit(versionGraph)
