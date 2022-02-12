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
  transactions: Record<string, Record<string, tx.Tx>>
}

export type BlocksParams = {
  from?: number
  to?: number
}

export type History = Pick<Block, 'height' | 'hash'>

export type HistoryParams = {
  from?: number
}

/**
 * Get block by height or hash.
 *
 * ```
 * const block = await block.block('https://api.xe.network', 100)
 *
 * const sameBlock = await block.block(
 *   'https://api.xe.network',
 *   '0000023f92bfed24ddb04bdcffaaac9e37b02b553a7cf35119990038cc8c223d'
 * )
 * ```
 */
export const block = async (host: string, ref: number | string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/block/${ref}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get blocks.
 *
 * ```
 * const blocks = await block.blocks('https://api.xe.network')
 * ```
 */
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

/**
 * Get genesis block.
 *
 * ```
 * const genesisBlock = await block.genesis('https://api.xe.network')
 * ```
 */
export const genesis = async (host: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/blocks/genesis`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get block history.
 *
 * ```
 * const hist = await block.history('https://api.xe.network')
 * ```
 */
export const history = async (
  host: string,
  params: HistoryParams,
  cb?: RequestCallback
): Promise<ListResponse<History, 'start' | 'from' | 'count' | 'limit'>> => {
  let url = `${host}/blocks/history`
  if (params !== undefined) url += `?${toQueryString(params)}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get latest blocks.
 *
 * ```
 * const latest = await block.latest('https://api.xe.network')
 * ```
 */
export const latest = async (host: string, cb?: RequestCallback): Promise<Block[]> => {
  const url = `${host}/blocks/history`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get block by parent hash.
 *
 * ```
 * const child = await block.parent(
 *   'https://api.xe.network',
 *   '0000023f92bfed24ddb04bdcffaaac9e37b02b553a7cf35119990038cc8c223d'
 * )
 * ```
 */
export const parent = async (host: string, hash: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/block/parent/${hash}`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}

/**
 * Get tip block.
 *
 * ```
 * const tip = await block.tip('https://api.xe.network')
 * ```
 */
export const tip = async (host: string, cb?: RequestCallback): Promise<Block> => {
  const url = `${host}/blocks/tip`
  const response = cb === undefined ? await superagent.get(url) : await cb(superagent.get(url))
  return response.body
}
