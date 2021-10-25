// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

export * as tx from './tx'
export * as wallet from './wallet'

import superagent from 'superagent'

export type Vars = {
  custodian_wallets: string[]
  host_stake_amount: number
  gateway_stake_amount: number
  stargate_stake_amount: number
  stake_unlock_period: number
  stake_express_release_fee: number
  stake_release_fee_wallet: string
  hash: string
}

export const vars = async (host: string): Promise<Vars> => {
  const url = `${host}/vars`
  const response = await superagent.get(url)
  return response.body as Vars
}
