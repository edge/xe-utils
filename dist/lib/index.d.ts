export * as block from './block';
export * as network from './network';
export * as proposal from './proposal';
export * as stake from './stake';
export * as tx from './tx';
export * as wallet from './wallet';
import { SuperAgentRequest } from 'superagent';
/**
 * API response template for a query.
 */
export declare type ListResponse<T, M extends string = 'from' | 'to' | 'count'> = {
    results: T[];
    metadata: Record<M, number>;
};
/**
 * Callback function allowing a SuperAgent HTTP request to be modified before it is sent.
 * For example, you may want to specify a 100ms request timeout while fetching transactions:
 *
 * ```
 * const txs = await tx.transactions('https://api.xe.network', undefined, r => r.timeout(100))
 * ```
 *
 * This approach enables user code to alter request behaviour using SuperAgent's API:
 * https://visionmedia.github.io/superagent/
 */
export declare type RequestCallback = (r: SuperAgentRequest) => SuperAgentRequest;
/**
 * On-chain variables.
 */
export declare type Vars = {
    custodian_wallets: string[];
    gateway_share: number;
    gateway_stake_amount: number;
    governance_stake_amount: number;
    governance_stake_unlock_period: number;
    host_stake_amount: number;
    proposal_comment_cost: number;
    proposal_cost: number;
    proposal_duration: number;
    proposal_fee_wallet: string;
    proposal_vote_cost: number;
    protocol: number;
    stake_express_release_fee: number;
    stake_release_fee_wallet: string;
    stake_unlock_period: number;
    stargate_share: number;
    stargate_stake_amount: number;
    hash: string;
};
/**
 * Get on-chain variables.
 *
 * ```
 * const mainnetVars = await vars('https://api.xe.network')
 * ```
 */
export declare const vars: (host: string, cb?: RequestCallback) => Promise<Vars>;
