import { RequestCallback } from '.';
export declare type Stake = {
    amount: number;
    created: number;
    hash: string;
    id: string;
    device?: string;
    deviceAssigned?: number;
    deviceUnassigned?: number;
    released?: number;
    releaseTransaction?: string;
    transaction: string;
    type: StakeType;
    unlockPeriod: number;
    unlockRequested?: number;
    unlockTransaction?: string;
};
export declare type Stakes = Record<string, Stake>;
export declare type StakeType = 'gateway' | 'host' | 'stargate';
/**
 * Get stakes associated with a wallet address.
 *
 * ```
 * const myStakes = await stakes('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export declare const stakes: (host: string, address: string, cb?: RequestCallback | undefined) => Promise<Stakes>;
/**
 * Get a stake by its hash.
 *
 * ```
 * const myStake = await stake('https://api.xe.network', 'my-hash')
 * ```
 */
export declare const stake: (host: string, hash: string, cb?: RequestCallback | undefined) => Promise<Stake>;
/**
 * Get a stake by wallet address and transaction hash.
 * This can be useful if the stake hash is not available.
 *
 * ```
 * const myStake = await stakeByTx('https://api.xe.network' 'my-wallet-address', 'my-hash')
 * ```
 */
export declare const stakeByTx: (host: string, address: string, hash: string, cb?: RequestCallback | undefined) => Promise<Stake>;
