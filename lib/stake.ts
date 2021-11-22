// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import superagent from 'superagent'

export type Stake = {
  amount: number
  created: number
  hash: string
  id: string
  device?: string
  deviceAssigned?: number
  deviceUnassigned?: number
  released?: number
  releaseTransaction?: string
  transaction: string
  type: StakeType
  unlockPeriod: number
  unlockRequested?: number
  unlockTransaction?: string
}

export type Stakes = Record<string, Stake>

export type StakeType = 'gateway' | 'host' | 'stargate'

/**
 * Get stakes associated with a wallet address.
 *
 * ```
 * const myStakes = await stakes('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export const stakes = async (host: string, address: string): Promise<Stakes> => {
  const url = `${host}/stakes/${address}`
  const response = await superagent.get(url)
  return response.body as Stakes
}
