/**
 * API response for creating on-chain transactions.
 *
 * See `createTransactions()` for more usage information.
 */
export declare type CreateResponse = {
    results: CreateTxReceipt[];
    metadata: {
        accepted?: number;
        ignored?: number;
        rejected?: number;
    };
};
/**
 * Receipt for the creation of an on-chain transaction.
 */
export declare type CreateTxReceipt = Partial<Tx> & {
    success: boolean;
    status: number;
    reason?: string;
    balance?: number;
    transaction_nonce?: number;
    wallet_nonce?: number;
    transaction: Omit<Tx, 'hash'>;
};
/**
 * Possible device actions that can be added to transaction data.
 *
 * See the `Tx` type and `createTransactions()` for more information.
 */
export declare type DeviceAction = 'assign_device' | 'unassign_device';
/**
 * API response template for a transactions query.
 */
export declare type ListResponse = {
    results: Tx[];
    metadata: {
        from: number;
        to: number;
        count: number;
    };
};
/**
 * Pre-chain, signed transaction.
 * This includes everything except the hash.
 */
export declare type SignedTx = Omit<Tx, 'hash'>;
/**
 * Possible stake actions that can be added to transaction data.
 *
 * See the `Tx` type and `createTransactions()` for more information.
 */
export declare type StakeAction = 'create_stake' | 'release_stake' | 'unlock_stake';
/**
 * On-chain transaction.
 */
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
/**
 * Bridge transaction data.
 * These values should only be set in exchange transactions created by Bridge.
 */
export declare type TxBridgeData = {
    /** Ethereum address for withdrawal/sale transaction. Used by Bridge. */
    destination?: string;
    /** Fee amount in an exchange transaction. Used by Bridge. */
    fee?: number;
    /** Exchange rate reference for sale transaction. Used by Bridge. */
    ref?: string;
};
/**
 * Transaction data.
 */
export declare type TxData = TxBridgeData & TxVarData & {
    /** Blockchain action to be effected in the course of creating the transaction. */
    action?: DeviceAction | StakeAction | VarAction;
    /** Device ID. Use with `action: DeviceAction` */
    device?: string;
    /** Express unlock flag. Use with `action: "unlock_stake"` */
    express?: boolean;
    /** Transaction memo. Can be any string. */
    memo?: string;
    /** Stake ID. Use with `action: DeviceAction | "release_stake" | "unlock_stake"` */
    stake?: string;
};
/**
 * Variables transaction data.
 * These values should only be set by a blockchain custodian when updating on-chain variables.
 */
export declare type TxVarData = {
    /** Variable name. Use with `action: VarAction` */
    key?: string;
    /** Variable value. Use with `action: "set_var"` */
    value?: unknown;
};
/**
 * Parameters for a transactions query.
 *
 * Both `from` and `to` reflect block height.
 */
export declare type TxsParams = {
    from?: number;
    to?: number;
};
/**
 * Pre-chain transaction that needs to be signed.
 */
export declare type UnsignedTx = Omit<Tx, 'hash' | 'signature'> & Partial<Pick<Tx, 'signature'>>;
/**
 * Possible variable setter actions. These are only usable by blockchain custodians.
 */
export declare type VarAction = 'set_var' | 'unset_var';
/**
 * Create one or more transactions on chain.
 *
 * Transactions must be signed, otherwise they will be rejected.
 * Wallet addresses are assumed to be correct; any validation should take place in user code.
 *
 * This function can also be used for staking transactions, by setting for example `data: { action: 'create_stake' }`.
 * Refer to staking documentation and the StakeAction type for more detail.
 *
 * ```
 * const myTx = sign({
 *   timestamp: Date.now(),
 *   sender: 'my-wallet-address',
 *   recipient: 'other-wallet-address',
 *   amount: 1000,
 *   data: { memo: 'example of sending 1 XE' },
 *   nonce: 1
 * }, 'my-private-key')
 *
 * const res = await createTransactions('https://api.xe.network', [myTx])
 * ```
 */
export declare const createTransactions: (host: string, txs: SignedTx[]) => Promise<CreateResponse>;
/**
 * Get pending transactions.
 *
 * Pass a wallet address to get only pending transactions from that address.
 *
 * ```
 * const allPendingTxs = await pendingTransactions('https://api.xe.network')
 *
 * const myPendingTxs = await pendingTransactions('https://api.xe.network', 'my-wallet-address')
 * ```
 */
export declare const pendingTransactions: (host: string, address?: string | undefined) => Promise<Tx[]>;
/**
 * Sign a transaction with a wallet private key.
 *
 * When using this function, consider the input (unsigned) transaction to be 'consumed', and use only the signed
 * transaction that is returned.
 * The signed transaction should not be modified, otherwise its signature may be invalidated.
 *
 * ```
 * const myTx = sign({
 *   timestamp: Date.now(),
 *   sender: 'my-wallet-address',
 *   recipient: 'other-wallet-address',
 *   amount: 1000,
 *   data: { memo: 'example of sending 1 XE' },
 *   nonce: 1
 * }, 'my-private-key')
 * ```
 */
export declare const sign: (tx: UnsignedTx, privateKey: string) => SignedTx;
/**
 * Prepare a signable transaction and signing message.
 *
 * Normally, user code should just use `sign()`.
 */
export declare const signable: (tx: UnsignedTx) => [UnsignedTx, string];
/**
 * Get recent transactions, or transactions within a specified block range.
 *
 * ```
 * const recent = await tx.transactions('https://api.xe.network')
 * const hist = await tx.transactions('https://api.xe.network', { from: 159335, to: 159345 })
 * ```
 */
export declare const transactions: (host: string, params?: TxsParams | undefined) => Promise<ListResponse>;
