// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { RequestCallback } from '.'
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
export const stakes = async (host: string, address: string, cb?: RequestCallback): Promise<Stakes> => {
  const url = `${host}/stakes/${address}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get a stake by its hash.
 *
 * ```
 * const myStake = await stake('https://api.xe.network', 'my-hash')
 * ```
 */
export const stake = async (host: string, hash: string, cb?: RequestCallback): Promise<Stake> => {
  const url = `${host}/stake/${hash}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get a stake by wallet address and transaction hash.
 * This can be useful if the stake hash is not available.
 *
 * ```
 * const myStake = await stakeByTx('https://api.xe.network' 'my-wallet-address', 'my-hash')
 * ```
 */
export const stakeByTx = async (host: string, address: string, hash: string, cb?: RequestCallback): Promise<Stake> => {
  const url = `${host}/stakes/${address}/${hash}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}
