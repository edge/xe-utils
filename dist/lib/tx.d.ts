export declare type CreateResponse = {
    results: CreateTxReceipt[];
    metadata: {
        accepted?: number;
        ignored?: number;
        rejected?: number;
    };
};
export declare type CreateTxReceipt = {
    success: boolean;
    status?: number;
    reason?: number;
    balance?: number;
    transaction_nonce?: number;
    wallet_nonce?: number;
    transaction: Tx;
};
export declare type ListResponse = {
    results: Tx[];
    metadata: {
        from: number;
        to: number;
        count: number;
    };
};
export declare type TxData = {
    memo?: string;
};
export declare type SignedTx = Omit<Tx, 'hash'>;
export declare type Tx = {
    timestamp: number;
    sender: string;
    recipient: string;
    amount: number;
    data: TxData;
    nonce: number;
    hash: string;
    signature: string;
};
export declare type TxsParams = {
    from?: number;
    to?: number;
};
export declare type UnsignedTx = Omit<Tx, 'hash' | 'signature'> & Partial<Pick<Tx, 'signature'>>;
export declare const createTransactions: (host: string, txs: SignedTx[]) => Promise<CreateResponse>;
export declare const pendingTransactions: (host: string, address?: string | undefined) => Promise<Tx[]>;
export declare const sign: (tx: UnsignedTx, privateKey: string) => SignedTx;
export declare const signable: (tx: UnsignedTx) => [UnsignedTx, string];
export declare const transactions: (host: string, address?: string | undefined, params?: TxsParams | undefined) => Promise<ListResponse>;
