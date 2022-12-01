import { Tx } from './tx';
import { RequestCallback, Vars } from '.';
export declare type Hashable = {
    created: number;
    duration: number;
    transaction: string;
    content: string;
};
export declare type Proposal = {
    created: number;
    duration: number;
    transaction: string;
    content: string;
    hash: string;
};
/**
 * Get the ledger hash of a proposal by reference to its corresponding transaction and vars at the time thereof.
 */
export declare const hash: (tx: Tx, vars: Pick<Vars, 'proposal_duration'>) => string;
/**
 * Prepare a Hashable object and message.
 *
 * Normally, user code should just use `hash()`.
 */
export declare const hashable: (tx: Tx, vars: Pick<Vars, 'proposal_duration'>) => [Hashable, string];
/**
 * Get a proposal by its hash.
 *
 * ```
 * const myProposal = await proposal('https://api.xe.network', 'my-hash')
 * ```
 */
export declare const proposal: (host: string, hash: string, cb?: RequestCallback) => Promise<Proposal>;
/**
 * Get a proposal by wallet address and transaction hash.
 * This can be useful if the proposal hash is not available.
 *
 * ```
 * const myProposal = await proposalByTx('https://api.xe.network' 'my-wallet-address', 'my-hash')
 * ```
 */
export declare const proposalByTx: (host: string, address: string, hash: string, cb?: RequestCallback) => Promise<Proposal>;
