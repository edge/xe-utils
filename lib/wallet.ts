// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.

import { RequestCallback } from '.'
import SHA256 from 'crypto-js/sha256'
import { Stakes } from './stake'
import elliptic from 'elliptic'
import { keccak256 } from 'js-sha3'
import { pendingTransactions } from './tx'
import superagent from 'superagent'

/**
 * A 'keypair' for an XE wallet.
 *
 * Internally, `publicKey` and `privateKey` constitute the keypair while the public `address` that is actually used is
 * calculated from the public key. All three values are provided by this type.
 */
export type Wallet = {
  address: string
  privateKey: string
  publicKey: string
}

/**
 * Current on-chain wallet status.
 *
 * The `balance` represents the current available balance (so excluding stakes) and the `nonce` is the current or next
 * nonce, depending on how wallet info is retrieved.
 *
 * See `info()` and `infoWithNextNonce()` for more usage information.
 */
export type WalletInfo = {
  address: string
  balance: number
  nonce: number
  stakes?: Record<string, Stakes>
}

// String transformations through which to checksum an XE address.
// Address is valid if output is identical to input.
const addressChecksum: ((address: string) => string)[] = [
  v => v.slice(3),
  v => {
    const h = keccak256(v.toLowerCase())
    return v.split('').map((c, i) => parseInt(h[i], 16) >= 8 ? c.toUpperCase() : c).join('')
  },
  v => `xe_${v}`
]

const addressRegexp = /^xe_[a-fA-F0-9]{40}$/
const privateKeyRegexp = /^[a-fA-F0-9]{64}$/

// String transformations through which to derive an XE address from a public key.
const addressTransform: ((publicKey: string) => string)[] = [
  v => keccak256(v),
  v => v.substring(v.length - 40),
  v => `xe_${v}`,
  ...addressChecksum
]

const ec = new elliptic.ec('secp256k1')

/**
 * Create a new wallet.
 */
export const create = (): Wallet => {
  const keyPair = ec.genKeyPair()
  const privateKey = padPrivateKey(keyPair.getPrivate('hex').toString())
  const publicKey = keyPair.getPublic(true, 'hex').toString()
  const address = deriveAddress(publicKey)
  return { address, privateKey, publicKey }
}

/**
 * Derive a wallet address from its corresponding public key.
 */
export const deriveAddress = (publicKey: string): string => addressTransform.reduce((v, f) => f(v), publicKey)

/**
 * Derive a wallet address from its corresponding private key.
 */
export const deriveAddressFromPrivateKey = (privateKey: string): string =>
  deriveAddress(publicKeyFromPrivateKey(privateKey))

/**
 * Derive a wallet address from a signed message.
 */
export const deriveAddressFromSignedMessage = (msg: string, signature: string): string =>
  deriveAddress(publicKeyFromSignedMessage(msg, signature))

/**
 * Generate a message signature using a private key.
 */
export const generateSignature = (privateKey: string, msg: string): string => {
  const msgHash = SHA256(msg).toString()
  const msgHashByteArray = elliptic.utils.toArray(msgHash, 'hex')
  const ecSignature = ec.sign(msgHashByteArray, ec.keyFromPrivate(privateKey), 'hex', { canonical: true })
  const r = ecSignature.r.toString('hex', 32)
  const s = ecSignature.s.toString('hex', 32)
  const i = (typeof ecSignature.recoveryParam === 'number')
    ? ecSignature.recoveryParam.toString(16).padStart(2, '0')
    : ''
  return r + s + i
}

/**
 * Get current on-chain wallet information.
 *
 * ```
 * const { balance } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export const info = async (host: string, address: string, cb?: RequestCallback): Promise<WalletInfo> => {
  const url = `${host}/wallet/${address}`
  const req = superagent.get(url)
  const res = cb === undefined ? await req : await cb(req)
  return res.body
}

/**
 * Get on-chain wallet information with its next transaction nonce.
 * This accounts for any pending transactions to ensure next nonce is correct.
 *
 * ```
 * const { balance, nonce } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export const infoWithNextNonce = async (host: string, address: string, cb?: RequestCallback): Promise<WalletInfo> => {
  const walletInfo = await info(host, address, cb)
  const txs = (await pendingTransactions(host, address, cb)).filter(tx => tx.sender === address)
  if (txs.length === 0) return walletInfo
  walletInfo.nonce = 1 + txs.reduce((a, b) => Math.max(a, b.nonce), walletInfo.nonce)
  return walletInfo
}

/** Pad private key with leading zeroes, if necessary, to ensure it is the expected length. */
export const padPrivateKey = (privateKey: string): string =>
  privateKey.length === 64 ? privateKey : privateKey.padStart(64, '0')

/**
 * Parse signature to recover constituent data.
 */
export const parseSignature = (signature: string): [elliptic.SignatureInput, number] => {
  const ecSignature = { r: signature.slice(0, 64), s: signature.slice(64, 128) }
  const recoveryParam = parseInt(signature.slice(128, 130), 16)
  return [ecSignature, recoveryParam]
}

/**
 * Derive a public key from its matching private key.
 */
export const publicKeyFromPrivateKey = (privateKey: string): string =>
  ec.keyFromPrivate(privateKey, 'hex').getPublic(true, 'hex')

/**
 * Recover a public key from a signed message.
 */
export const publicKeyFromSignedMessage = (msg: string, signature: string): string => {
  const [ecSignature, recoveryParam] = parseSignature(signature)
  const msgHash = SHA256(msg).toString()
  const msgHashByteArray = elliptic.utils.toArray(msgHash, 'hex')
  const publicKeyObj = ec.recoverPubKey(msgHashByteArray, ecSignature, recoveryParam, 'hex')
  return publicKeyObj.encode('hex', true)
}

/**
 * Recover a wallet from its matching private key.
 */
export const recover = (privateKey: string): Wallet => {
  const publicKey = publicKeyFromPrivateKey(privateKey)
  const address = deriveAddress(publicKey)
  return { address, privateKey: padPrivateKey(privateKey), publicKey }
}

/**
 * Validate the format of a wallet address.
 */
export const validateAddress = (address: string): boolean =>
  addressRegexp.test(address) && addressChecksum.reduce((v, f) => f(v), address) === address

/**
 * Validate the format of a private key.
 */
export const validatePrivateKey = (privateKey: string): boolean => privateKeyRegexp.test(privateKey)

/**
 * Validate a message-signature pair by comparing address input with recovered wallet address.
 */
export const validateSignatureAddress = (msg: string, signature: string, address: string): boolean =>
  deriveAddressFromSignedMessage(msg, signature) === address
