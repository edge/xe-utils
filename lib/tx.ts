// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
import { generateSignature } from './wallet'
import superagent from 'superagent'
import { toQueryString } from './helpers'

export type CreateResponse = {
  results: CreateTxReceipt[]
  metadata: {
    accepted?: number
    ignored?: number
    rejected?: number
  }
}

export type CreateTxReceipt = {
  success: boolean
  status?: number
  reason?: number

  // https://github.com/edge/blockchain/blob/0a25bf472447afc4e2818b023fa7ab965ad5996e/src/mempool/index.js#L75-L122
  balance?: number
  transaction_nonce?: number
  wallet_nonce?: number

  transaction: Tx
}

export type ListResponse = {
  results: Tx[]
  metadata: {
    from: number
    to: number
    count: number
  }
}

export type TxData = {
  memo?: string
}

export type SignedTx = Omit<Tx, 'hash'>

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

export type TxsParams = {
  from?: number
  to?: number
}

export type UnsignedTx = Omit<Tx, 'hash' | 'signature'> & Partial<Pick<Tx, 'signature'>>

export const createTransactions = async (host: string, txs: SignedTx[]): Promise<CreateResponse> => {
  const response = await superagent.post(`${host}/transaction`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(txs)
  return response.body as CreateResponse
}

export const pendingTransactions = async (host: string, address?: string): Promise<Tx[]> => {
  let url = `${host}/transactions/pending`
  if (address !== undefined) url += `/${address}`
  const response = await superagent.get(url)
  return response.body as Tx[]
}

export const sign = (tx: UnsignedTx, privateKey: string): SignedTx => {
  const [controlTx, message] = signable(tx)
  controlTx.signature = generateSignature(privateKey, message)
  return controlTx as SignedTx
}

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

export const transactions = async (host: string, address?: string, params?: TxsParams): Promise<ListResponse> => {
  let url = `${host}/transactions`
  if (address !== undefined) url += `/${address}`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const response = await superagent.get(url)
  return response.body as ListResponse
}

export default {}
