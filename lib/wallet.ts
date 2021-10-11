// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
import SHA256 from 'crypto-js/sha256'
import elliptic from 'elliptic'
import { keccak256 } from 'js-sha3'
import { pendingTransactions } from './tx'
import superagent from 'superagent'

export type Wallet = {
  address: string
  privateKey: string
  publicKey: string
}

export type WalletInfo = {
  address: string
  balance: number
  nonce: number
}

// string transformations through which to checksum an XE address. address is valid if output is identical to input
const addressChecksum: ((address: string) => string)[] = [
  v => v.slice(3),
  v => {
    const h = keccak256(v.toLowerCase())
    return v.split('').map((c, i) => parseInt(h[i], 16) >= 8 ? c.toUpperCase() : c).join('')
  },
  v => `xe_${v}`
]

const addressRegexp = /^xe_[a-fA-F0-9]{40}$/

// string transformations through which to derive an XE address from a public key
const addressTransform: ((publicKey: string) => string)[] = [
  v => keccak256(v),
  v => v.substring(v.length - 40),
  v => `xe_${v}`,
  ...addressChecksum
]

const ec = new elliptic.ec('secp256k1')

// create new wallet
export const create = (): Wallet => {
  const keyPair = ec.genKeyPair()
  const privateKey = keyPair.getPrivate('hex').toString()
  const publicKey = keyPair.getPublic(true, 'hex').toString()
  const address = deriveAddress(publicKey)
  return { address, privateKey, publicKey }
}

export const deriveAddress = (publicKey: string): string => addressTransform.reduce((v, f) => f(v), publicKey)

export const deriveAddressFromPrivateKey = (privateKey: string): string =>
  deriveAddress(publicKeyFromPrivateKey(privateKey))

export const deriveAddressFromSignedMessage = (msg: string, signature: string): string =>
  deriveAddress(publicKeyFromSignedMessage(msg, signature))

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

export const info = async (host: string, address: string): Promise<WalletInfo> => {
  const url = `${host}/wallet/${address}`
  const response = await superagent.get(url)
  return response.body as WalletInfo
}

export const infoWithNextNonce = async (host: string, address: string): Promise<WalletInfo> => {
  const walletInfo = await info(host, address)
  const txs = (await pendingTransactions(host, address)).filter(tx => tx.sender === address)
  if (txs.length === 0) return walletInfo
  walletInfo.nonce = 1 + txs.reduce((a, b) => Math.max(a, b.nonce), walletInfo.nonce)
  return walletInfo
}

export const parseSignature = (signature: string): [elliptic.SignatureInput, number] => {
  const ecSignature = { r: signature.slice(0, 64), s: signature.slice(64, 128) }
  const recoveryParam = parseInt(signature.slice(128, 130), 16)
  return [ecSignature, recoveryParam]
}

export const publicKeyFromPrivateKey = (privateKey: string): string =>
  ec.keyFromPrivate(privateKey, 'hex').getPublic(true, 'hex')

export const publicKeyFromSignedMessage = (msg: string, signature: string): string => {
  const [ecSignature, recoveryParam] = parseSignature(signature)
  const msgHash = SHA256(msg).toString()
  const msgHashByteArray = elliptic.utils.toArray(msgHash, 'hex')
  const publicKeyObj = ec.recoverPubKey(msgHashByteArray, ecSignature, recoveryParam, 'hex')
  return publicKeyObj.encode('hex', true)
}

export const recover = (privateKey: string): Wallet => {
  const publicKey = publicKeyFromPrivateKey(privateKey)
  const address = deriveAddress(publicKey)
  return { address, privateKey, publicKey }
}

export const validateAddress = (address: string): boolean =>
  addressRegexp.test(address) && addressChecksum.reduce((v, f) => f(v), address) === address

export const validateSignatureAddress = (msg: string, signature: string, address: string): boolean =>
  deriveAddressFromSignedMessage(msg, signature) === address
