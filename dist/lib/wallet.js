"use strict";
// Copyright (C) 2021 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.validateSignatureAddress = exports.validatePrivateKey = exports.validateAddress = exports.recover = exports.publicKeyFromSignedMessage = exports.publicKeyFromPrivateKey = exports.parseSignature = exports.padPrivateKey = exports.infoWithNextNonce = exports.info = exports.generateSignature = exports.deriveAddressFromSignedMessage = exports.deriveAddressFromPrivateKey = exports.deriveAddress = exports.create = void 0;
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var elliptic_1 = __importDefault(require("elliptic"));
var js_sha3_1 = require("js-sha3");
var tx_1 = require("./tx");
var superagent_1 = __importDefault(require("superagent"));
// String transformations through which to checksum an XE address.
// Address is valid if output is identical to input.
var addressChecksum = [
    function (v) { return v.slice(3); },
    function (v) {
        var h = (0, js_sha3_1.keccak256)(v.toLowerCase());
        return v.split('').map(function (c, i) { return parseInt(h[i], 16) >= 8 ? c.toUpperCase() : c; }).join('');
    },
    function (v) { return "xe_".concat(v); }
];
var addressRegexp = /^xe_[a-fA-F0-9]{40}$/;
var privateKeyRegexp = /^[a-fA-F0-9]{64}$/;
// String transformations through which to derive an XE address from a public key.
var addressTransform = __spreadArray([
    function (v) { return (0, js_sha3_1.keccak256)(v); },
    function (v) { return v.substring(v.length - 40); },
    function (v) { return "xe_".concat(v); }
], addressChecksum, true);
var ec = new elliptic_1["default"].ec('secp256k1');
/**
 * Create a new wallet.
 */
var create = function () {
    var keyPair = ec.genKeyPair();
    var privateKey = (0, exports.padPrivateKey)(keyPair.getPrivate('hex').toString());
    var publicKey = keyPair.getPublic(true, 'hex').toString();
    var address = (0, exports.deriveAddress)(publicKey);
    return { address: address, privateKey: privateKey, publicKey: publicKey };
};
exports.create = create;
/**
 * Derive a wallet address from its corresponding public key.
 */
var deriveAddress = function (publicKey) { return addressTransform.reduce(function (v, f) { return f(v); }, publicKey); };
exports.deriveAddress = deriveAddress;
/**
 * Derive a wallet address from its corresponding private key.
 */
var deriveAddressFromPrivateKey = function (privateKey) {
    return (0, exports.deriveAddress)((0, exports.publicKeyFromPrivateKey)(privateKey));
};
exports.deriveAddressFromPrivateKey = deriveAddressFromPrivateKey;
/**
 * Derive a wallet address from a signed message.
 */
var deriveAddressFromSignedMessage = function (msg, signature) {
    return (0, exports.deriveAddress)((0, exports.publicKeyFromSignedMessage)(msg, signature));
};
exports.deriveAddressFromSignedMessage = deriveAddressFromSignedMessage;
/**
 * Generate a message signature using a private key.
 */
var generateSignature = function (privateKey, msg) {
    var msgHash = (0, sha256_1["default"])(msg).toString();
    var msgHashByteArray = elliptic_1["default"].utils.toArray(msgHash, 'hex');
    var ecSignature = ec.sign(msgHashByteArray, ec.keyFromPrivate(privateKey), 'hex', { canonical: true });
    var r = ecSignature.r.toString('hex', 32);
    var s = ecSignature.s.toString('hex', 32);
    var i = (typeof ecSignature.recoveryParam === 'number')
        ? ecSignature.recoveryParam.toString(16).padStart(2, '0')
        : '';
    return r + s + i;
};
exports.generateSignature = generateSignature;
/**
 * Get current on-chain wallet information.
 *
 * ```
 * const { balance } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
var info = function (host, address, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/wallet/").concat(address);
                req = superagent_1["default"].get(url);
                if (!(cb === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, req];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, cb(req)];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                res = _a;
                return [2 /*return*/, res.body];
        }
    });
}); };
exports.info = info;
/**
 * Get on-chain wallet information with its next transaction nonce.
 * This accounts for any pending transactions to ensure next nonce is correct.
 *
 * ```
 * const { balance, nonce } = await info('https://api.xe.network', 'my-wallet-address')
 * ```
 */
var infoWithNextNonce = function (host, address, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var walletInfo, txs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.info)(host, address, cb)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, (0, tx_1.pendingTransactions)(host, address, cb)];
            case 2:
                txs = (_a.sent()).filter(function (tx) { return tx.sender === address; });
                if (txs.length === 0)
                    return [2 /*return*/, walletInfo];
                walletInfo.nonce = 1 + txs.reduce(function (a, b) { return Math.max(a, b.nonce); }, walletInfo.nonce);
                return [2 /*return*/, walletInfo];
        }
    });
}); };
exports.infoWithNextNonce = infoWithNextNonce;
/** Pad private key with leading zeroes, if necessary, to ensure it is the expected length. */
var padPrivateKey = function (privateKey) {
    return privateKey.length === 64 ? privateKey : privateKey.padStart(64, '0');
};
exports.padPrivateKey = padPrivateKey;
/**
 * Parse signature to recover constituent data.
 */
var parseSignature = function (signature) {
    var ecSignature = { r: signature.slice(0, 64), s: signature.slice(64, 128) };
    var recoveryParam = parseInt(signature.slice(128, 130), 16);
    return [ecSignature, recoveryParam];
};
exports.parseSignature = parseSignature;
/**
 * Derive a public key from its matching private key.
 */
var publicKeyFromPrivateKey = function (privateKey) {
    return ec.keyFromPrivate(privateKey, 'hex').getPublic(true, 'hex');
};
exports.publicKeyFromPrivateKey = publicKeyFromPrivateKey;
/**
 * Recover a public key from a signed message.
 */
var publicKeyFromSignedMessage = function (msg, signature) {
    var _a = (0, exports.parseSignature)(signature), ecSignature = _a[0], recoveryParam = _a[1];
    var msgHash = (0, sha256_1["default"])(msg).toString();
    var msgHashByteArray = elliptic_1["default"].utils.toArray(msgHash, 'hex');
    var publicKeyObj = ec.recoverPubKey(msgHashByteArray, ecSignature, recoveryParam, 'hex');
    return publicKeyObj.encode('hex', true);
};
exports.publicKeyFromSignedMessage = publicKeyFromSignedMessage;
/**
 * Recover a wallet from its matching private key.
 */
var recover = function (privateKey) {
    var publicKey = (0, exports.publicKeyFromPrivateKey)(privateKey);
    var address = (0, exports.deriveAddress)(publicKey);
    return { address: address, privateKey: (0, exports.padPrivateKey)(privateKey), publicKey: publicKey };
};
exports.recover = recover;
/**
 * Validate the format of a wallet address.
 */
var validateAddress = function (address) {
    return addressRegexp.test(address) && addressChecksum.reduce(function (v, f) { return f(v); }, address) === address;
};
exports.validateAddress = validateAddress;
/**
 * Validate the format of a private key.
 */
var validatePrivateKey = function (privateKey) { return privateKeyRegexp.test(privateKey); };
exports.validatePrivateKey = validatePrivateKey;
/**
 * Validate a message-signature pair by comparing address input with recovered wallet address.
 */
var validateSignatureAddress = function (msg, signature, address) {
    return (0, exports.deriveAddressFromSignedMessage)(msg, signature) === address;
};
exports.validateSignatureAddress = validateSignatureAddress;
