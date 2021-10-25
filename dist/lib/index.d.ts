export * as tx from './tx';
export * as wallet from './wallet';
export declare type Vars = {
    custodian_wallets: string[];
    host_stake_amount: number;
    gateway_stake_amount: number;
    stargate_stake_amount: number;
    stake_unlock_period: number;
    stake_express_release_fee: number;
    stake_release_fee_wallet: string;
    hash: string;
};
export declare const vars: (host: string) => Promise<Vars>;
