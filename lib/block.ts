import superagent from 'superagent'
import { toQueryString } from './helpers'
import { ListResponse, RequestCallback, tx } from '.'

export type Block = {
  timestamp: number
  height: number
  parent: string
  data: BlockData
  ledgerHash: string
  nonce: number
  difficulty: number
  dataHash: string
  hash: string
}

export type BlockData = {
  /** Only present on genesis block */
  chainId?: string
  transactions: Record<string, tx.Tx[]>
}

export type BlocksParams = {
  from?: number
  to?: number
}

export const block = async (host: string, ref: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/block/${ref}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

export const blocks = async (
  host: string,
  params: BlocksParams,
  cb?: RequestCallback
): Promise<ListResponse<Block>> => {
  let url = `${host}/blocks`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

export const genesis = async (host: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/blocks/genesis`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

export const tip = async (host: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/blocks/tip`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}
