// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { generateSignature } from './wallet'
import superagent from 'superagent'
import { toQueryString } from './helpers'
import { ListResponse, RequestCallback } from '.'

/**
 * API response for creating on-chain transactions.
 *
 * See `createTransactions()` for more usage information.
 */
export type CreateResponse = {
  results: CreateTxReceipt[]
  metadata: {
    accepted?: number
    ignored?: number
    rejected?: number
  }
}

/**
 * Receipt for the creation of an on-chain transaction.
 */
export type CreateTxReceipt = Partial<Tx> & {
  success: boolean
  status: number
  reason?: string

  balance?: number
  transaction_nonce?: number
  wallet_nonce?: number

  transaction: Omit<Tx, 'hash'>
}

/**
 * Possible device actions that can be added to transaction data.
 *
 * See the `Tx` type and `createTransactions()` for more information.
 */
export type DeviceAction = 'assign_device' | 'unassign_device'

/**
 * Possible governance actions that can be added to transaction data.
 *
 * See the `Tx` type and `createTransactions()` for more information.
 */
export type GovernanceAction = 'create_proposal' | 'proposal_comment' | 'proposal_vote'

/**
 * Pre-chain, signed transaction.
 * This includes everything except the hash.
 */
export type SignedTx = Omit<Tx, 'hash'>

/**
 * Possible stake actions that can be added to transaction data.
 *
 * See the `Tx` type and `createTransactions()` for more information.
 */
export type StakeAction = 'create_stake' | 'release_stake' | 'unlock_stake'

/**
 * On-chain transaction.
 */
export type Tx = {
  timestamp: number
  sender: string
  recipient: string
  amount: number
  data: TxData
  nonce: number
  hash: string
  signature: string
}

/**
 * Bridge transaction data.
 * These values should only be set in exchange transactions created by Bridge.
 */
export type TxBridgeData = {
  /** Ethereum address for exchange (withdrawal/sale) transaction. Used by Bridge. */
  destination?: string
  /** Fee amount in an exchange transaction. Used by Bridge. */
  fee?: number
  /** Exchange token. Used by Bridge. */
  token?: string
}

/**
 * Transaction data.
 */
export type TxData = TxBridgeData & TxGovernanceData & TxVarData & {
  /** Blockchain action to be effected in the course of creating the transaction. */
  action?: DeviceAction | GovernanceAction | StakeAction | VarAction
  /** Device ID. Use with `action: "assign_device" | "unassign_device"` */
  device?: string
  /** Express unlock flag. Use with `action: "unlock_stake"` */
  express?: boolean
  /** Reference hash. Used by external systems. */
  ref?: string
  /** Transaction memo. */
  memo?: string
  /**
   * Signature for other data - unrelated to transaction signature.
   * Use with `action: "assign_device"` to sign the device address with its key.
   */
  signature?: string
  /** Stake hash. Use with `action: "assign_device" | "release_stake" | "unassign_device" | "unlock_stake"` */
  stake?: string
}

/**
 * Governance transaction data.
 */
export type TxGovernanceData = {
  /** Content hash. Use with `action: "create_proposal"` or `action: "proposal_comment"` */
  content?: string
  /** Proposal hash. Use with `action: "proposal_comment"` or `action: "proposal_vote"` */
  proposal?: string
  /** Vote option. */
  vote?: number
}

/**
 * Variables transaction data.
 * These values should only be set by a blockchain custodian when updating on-chain variables.
 */
export type TxVarData = {
  /** Variable name. Use with `action: VarAction` */
  key?: string
  /** Variable value. Use with `action: "set_var"` */
  value?: unknown
}

/**
 * Parameters for a transactions query.
 *
 * Both `from` and `to` reflect block height.
 */
export type TxsParams = {
  from?: number
  to?: number
}

/**
 * Pre-chain transaction that needs to be signed.
 */
export type UnsignedTx = Omit<Tx, 'hash' | 'signature'> & Partial<Pick<Tx, 'signature'>>

/**
 * Possible variable setter actions. These are only usable by blockchain custodians.
 */
export type VarAction = 'set_var' | 'unset_var'

/**
 * Create one or more transactions on chain.
 *
 * Transactions must be signed, otherwise they will be rejected.
 * Wallet addresses are assumed to be correct; any validation should take place in user code.
 *
 * This function can also be used for staking transactions, by setting for example `data: { action: 'create_stake' }`.
 * Refer to staking documentation and the StakeAction type for more detail.
 *
 * ```
 * const myTx = sign({
 *   timestamp: Date.now(),
 *   sender: 'my-wallet-address',
 *   recipient: 'other-wallet-address',
 *   amount: 1000,
 *   data: { memo: 'example of sending 1 XE' },
 *   nonce: 1
 * }, 'my-private-key')
 *
 * const res = await createTransactions('https://api.xe.network', [myTx])
 * ```
 */
export const createTransactions =
  async (host: string, txs: SignedTx[], cb?: RequestCallback): Promise<CreateResponse> => {
    const request = superagent.post(`${host}/transaction`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(txs)
    if (cb !== undefined) cb(request)
    const response = await request
    return response.body
  }

/**
 * Get pending transactions.
 *
 * Pass a wallet address to get only pending transactions from that address.
 *
 * ```
 * const allPendingTxs = await pendingTransactions('https://api.xe.network')
 *
 * const myPendingTxs = await pendingTransactions('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export const pendingTransactions = async (host: string, address?: string, cb?: RequestCallback): Promise<Tx[]> => {
  let url = `${host}/transactions/pending`
  if (address !== undefined) url += `/${address}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Sign a transaction with a wallet private key.
 *
 * When using this function, consider the input (unsigned) transaction to be 'consumed', and use only the signed
 * transaction that is returned.
 * The signed transaction should not be modified, otherwise its signature may be invalidated.
 *
 * ```
 * const myTx = sign({
 *   timestamp: Date.now(),
 *   sender: 'my-wallet-address',
 *   recipient: 'other-wallet-address',
 *   amount: 1000,
 *   data: { memo: 'example of sending 1 XE' },
 *   nonce: 1
 * }, 'my-private-key')
 * ```
 */
export const sign = (tx: UnsignedTx, privateKey: string): SignedTx => {
  const [controlTx, message] = signable(tx)
  controlTx.signature = generateSignature(privateKey, message)
  return controlTx as SignedTx
}

/**
 * Prepare a signable transaction and signing message.
 *
 * Normally, user code should just use `sign()`.
 */
export const signable = (tx: UnsignedTx): [UnsignedTx, string] => {
  const controlTx: UnsignedTx = {
    timestamp: tx.timestamp,
    sender: tx.sender,
    recipient: tx.recipient,
    amount: tx.amount,
    data: tx.data,
    nonce: tx.nonce
  }
  return [controlTx, JSON.stringify(controlTx)]
}

/**
 * Get recent transactions, or transactions within a specified block range.
 *
 * ```
 * const recent = await tx.transactions('https://api.xe.network')
 * const hist = await tx.transactions('https://api.xe.network', { from: 159335, to: 159345 })
 * ```
 */
export const transactions = async (
  host: string,
  params?: TxsParams,
  cb?: RequestCallback
): Promise<ListResponse<Tx>> => {
  let url = `${host}/transactions`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}
