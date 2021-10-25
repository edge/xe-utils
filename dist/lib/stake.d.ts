export declare type Stake = {
    amount: number;
    created: number;
    hash: string;
    id: string;
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
export declare const stakes: (host: string, address: string) => Promise<Stakes>;
