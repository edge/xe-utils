import { RequestCallback } from '.';
import { Stakes } from './stake';
import elliptic from 'elliptic';
/**
 * A 'keypair' for an XE wallet.
 *
 * Internally, `publicKey` and `privateKey` constitute the keypair while the public `address` that is actually used is
 * calculated from the public key. All three values are provided by this type.
 */
export declare type Wallet = {
    address: string;
    privateKey: string;
    publicKey: string;
};
/**
 * Current on-chain wallet status.
 *
 * The `balance` represents the current available balance (so excluding stakes) and the `nonce` is the current or next
 * nonce, depending on how wallet info is retrieved.
 *
 * See `info()` and `infoWithNextNonce()` for more usage information.
 */
export declare type WalletInfo = {
    address: string;
    balance: number;
    nonce: number;
    stakes?: Record<string, Stakes>;
};
/**
 * Create a new wallet.
 */
export declare const create: () => Wallet;
/**
 * Derive a wallet address from its corresponding public key.
 */
export declare const deriveAddress: (publicKey: string) => string;
/**
 * Derive a wallet address from its corresponding private key.
 */
export declare const deriveAddressFromPrivateKey: (privateKey: string) => string;
/**
 * Derive a wallet address from a signed message.
 */
export declare const deriveAddressFromSignedMessage: (msg: string, signature: string) => string;
/**
 * Generate a message signature using a private key.
 */
export declare const generateSignature: (privateKey: string, msg: string) => string;
/**
 * Get current on-chain wallet information.
 *
 * ```
 * const { balance } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export declare const info: (host: string, address: string, cb?: RequestCallback) => Promise<WalletInfo>;
/**
 * Get on-chain wallet information with its next transaction nonce.
 * This accounts for any pending transactions to ensure next nonce is correct.
 *
 * ```
 * const { balance, nonce } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export declare const infoWithNextNonce: (host: string, address: string, cb?: RequestCallback) => Promise<WalletInfo>;
/** Pad private key with leading zeroes, if necessary, to ensure it is the expected length. */
export declare const padPrivateKey: (privateKey: string) => string;
/**
 * Parse signature to recover constituent data.
 */
export declare const parseSignature: (signature: string) => [elliptic.SignatureInput, number];
/**
 * Derive a public key from its matching private key.
 */
export declare const publicKeyFromPrivateKey: (privateKey: string) => string;
/**
 * Recover a public key from a signed message.
 */
export declare const publicKeyFromSignedMessage: (msg: string, signature: string) => string;
/**
 * Recover a wallet from its matching private key.
 */
export declare const recover: (privateKey: string) => Wallet;
/**
 * Validate the format of a wallet address.
 */
export declare const validateAddress: (address: string) => boolean;
/**
 * Validate the format of a private key.
 */
export declare const validatePrivateKey: (privateKey: string) => boolean;
/**
 * Validate a message-signature pair by comparing address input with recovered wallet address.
 */
export declare const validateSignatureAddress: (msg: string, signature: string, address: string) => boolean;
