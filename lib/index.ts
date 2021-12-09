// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

export * as stake from './stake'
export * as tx from './tx'
export * as wallet from './wallet'

import superagent, { SuperAgentRequest } from 'superagent'

/**
 * Callback function allowing a SuperAgent HTTP request to be modified before it is sent.
 * For example, you may want to specify a 100ms request timeout while fetching transactions:
 *
 * ```
 * const txs = await tx.transactions('https://api.xe.network', undefined, r => r.timeout(100))
 * ```
 *
 * This approach enables user code to alter request behaviour using SuperAgent's API:
 * https://visionmedia.github.io/superagent/
 */
export type RequestCallback = (r: SuperAgentRequest) => SuperAgentRequest

/**
 * On-chain variables.
 */
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

/**
 * Get on-chain variables.
 *
 * ```
 * const mainnetVars = await vars('https://api.xe.network')
 * ```
 */
export const vars = async (host: string, cb?: RequestCallback): Promise<Vars> => {
  const url = `${host}/vars`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}
