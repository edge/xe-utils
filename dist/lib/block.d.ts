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
export declare const block: (host: string, ref: string, cb?: RequestCallback | undefined) => Promise<Block>;
export declare const blocks: (host: string, params: BlocksParams, cb?: RequestCallback | undefined) => Promise<ListResponse<Block>>;
export declare const genesis: (host: string, cb?: RequestCallback | undefined) => Promise<Block>;
export declare const tip: (host: string, cb?: RequestCallback | undefined) => Promise<Block>;
