// tslint:disable:max-line-length

import { Sequelize, Options, SyncOptions } from 'sequelize'

import { init as initPost } from './Post'

export async function initialize(
  options: Options = {}, syncOptions: SyncOptions = {},
) {
  const sequelize = new Sequelize(options)

  initPost(sequelize)

  await sequelize.sync(syncOptions)

  return sequelize
}
