import { SHA256 } from 'crypto-js'
import { Tx } from './tx'
import superagent from 'superagent'
import { RequestCallback, Vars } from '.'

export type Hashable = {
  created: number
  duration: number
  transaction: string
  content: string
}

export type Proposal = {
  created: number
  duration: number
  transaction: string
  content: string
  hash: string
}

/**
 * Get the ledger hash of a proposal by reference to its corresponding transaction and vars at the time thereof.
 */
export const hash = (tx: Tx, vars: Pick<Vars, 'proposal_duration'>): string => {
  const [, message] = hashable(tx, vars)
  return SHA256(message).toString()
}

/**
 * Prepare a Hashable object and message.
 *
 * Normally, user code should just use `hash()`.
 */
export const hashable = (tx: Tx, vars: Pick<Vars, 'proposal_duration'>): [Hashable, string] => {
  if (tx.data.action !== 'create_proposal') throw new Error('incorrect action')
  if (!tx.data.content) throw new Error('missing content')
  const ha: Hashable = {
    created: tx.timestamp,
    duration: vars.proposal_duration,
    transaction: tx.hash,
    content: tx.data.content
  }
  return [ha, JSON.stringify(ha)]
}

/**
 * Get a proposal by its hash.
 *
 * ```
 * const myProposal = await proposal('https://api.xe.network', 'my-hash')
 * ```
 */
export const proposal = async (host: string, hash: string, cb?: RequestCallback): Promise<Proposal> => {
  const url = `${host}/proposal/${hash}`
  const req = superagent.get(url)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}

/**
 * Get a proposal by wallet address and transaction hash.
 * This can be useful if the proposal hash is not available.
 *
 * ```
 * const myProposal = await proposalByTx('https://api.xe.network' 'my-wallet-address', 'my-hash')
 * ```
 */
export const proposalByTx = async (
  host: string,
  address: string,
  hash: string,
  cb?: RequestCallback
): Promise<Proposal> => {
  const url = `${host}/proposals/${address}/${hash}`
  const req = superagent.get(url)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}
