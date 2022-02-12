import { ListResponse, RequestCallback, tx } from '.';
export declare type Block = {
    timestamp: number;
    height: number;
    parent: string;
    data: BlockData;
    ledgerHash: string;
    nonce: number;
    difficulty: number;
    dataHash: string;
    hash: string;
};
export declare type BlockData = {
    /** Only present on genesis block */
    chainId?: string;
    transactions: Record<string, Record<string, tx.Tx>>;
};
export declare type BlocksParams = {
    from?: number;
    to?: number;
};
export declare type History = Pick<Block, 'height' | 'hash'>;
export declare type HistoryParams = {
    from?: number;
};
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
export declare const block: (host: string, ref: number | string, cb?: RequestCallback | undefined) => Promise<Block>;
/**
 * Get blocks.
 *
 * ```
 * const blocks = await block.blocks('https://api.xe.network')
 * ```
 */
export declare const blocks: (host: string, params: BlocksParams, cb?: RequestCallback | undefined) => Promise<ListResponse<Block>>;
/**
 * Get genesis block.
 *
 * ```
 * const genesisBlock = await block.genesis('https://api.xe.network')
 * ```
 */
export declare const genesis: (host: string, cb?: RequestCallback | undefined) => Promise<Block>;
/**
 * Get block history.
 *
 * ```
 * const hist = await block.history('https://api.xe.network')
 * ```
 */
export declare const history: (host: string, params: HistoryParams, cb?: RequestCallback | undefined) => Promise<ListResponse<History, 'start' | 'from' | 'count' | 'limit'>>;
/**
 * Get latest blocks.
 *
 * ```
 * const latest = await block.latest('https://api.xe.network')
 * ```
 */
export declare const latest: (host: string, cb?: RequestCallback | undefined) => Promise<Block[]>;
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
export declare const parent: (host: string, hash: string, cb?: RequestCallback | undefined) => Promise<Block>;
/**
 * Get tip block.
 *
 * ```
 * const tip = await block.tip('https://api.xe.network')
 * ```
 */
export declare const tip: (host: string, cb?: RequestCallback | undefined) => Promise<Block>;
