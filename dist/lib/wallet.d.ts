import elliptic from 'elliptic';
export declare type Wallet = {
    address: string;
    privateKey: string;
    publicKey: string;
};
export declare type WalletInfo = {
    address: string;
    balance: number;
    nonce: number;
};
export declare const create: () => Wallet;
export declare const deriveAddress: (publicKey: string) => string;
export declare const deriveAddressFromPrivateKey: (privateKey: string) => string;
export declare const deriveAddressFromSignedMessage: (msg: string, signature: string) => string;
export declare const generateSignature: (privateKey: string, msg: string) => string;
export declare const info: (host: string, address: string) => Promise<WalletInfo>;
export declare const infoWithNextNonce: (host: string, address: string) => Promise<WalletInfo>;
export declare const parseSignature: (signature: string) => [elliptic.SignatureInput, number];
export declare const publicKeyFromPrivateKey: (privateKey: string) => string;
export declare const publicKeyFromSignedMessage: (msg: string, signature: string) => string;
export declare const recover: (privateKey: string) => Wallet;
export declare const validateAddress: (address: string) => boolean;
export declare const validateSignatureAddress: (msg: string, signature: string, address: string) => boolean;
