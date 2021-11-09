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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.transactions = exports.signable = exports.sign = exports.pendingTransactions = exports.createTransactions = void 0;
var wallet_1 = require("./wallet");
var superagent_1 = __importDefault(require("superagent"));
var helpers_1 = require("./helpers");
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
var createTransactions = function (host, txs) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, superagent_1["default"].post(host + "/transaction")
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .send(txs)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.body];
        }
    });
}); };
exports.createTransactions = createTransactions;
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
var pendingTransactions = function (host, address) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = host + "/transactions/pending";
                if (address !== undefined)
                    url += "/" + address;
                return [4 /*yield*/, superagent_1["default"].get(url)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.body];
        }
    });
}); };
exports.pendingTransactions = pendingTransactions;
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
var sign = function (tx, privateKey) {
    var _a = (0, exports.signable)(tx), controlTx = _a[0], message = _a[1];
    controlTx.signature = (0, wallet_1.generateSignature)(privateKey, message);
    return controlTx;
};
exports.sign = sign;
/**
 * Prepare a signable transaction and signing message.
 *
 * Normally, user code should just use `sign()`.
 */
var signable = function (tx) {
    var controlTx = {
        timestamp: tx.timestamp,
        sender: tx.sender,
        recipient: tx.recipient,
        amount: tx.amount,
        data: tx.data,
        nonce: tx.nonce
    };
    return [controlTx, JSON.stringify(controlTx)];
};
exports.signable = signable;
/**
 * Get recent transactions, or transactions within a specified block range.
 *
 * ```
 * const recent = await tx.transactions('https://api.xe.network')
 * const hist = await tx.transactions('https://api.xe.network', { from: 159335, to: 159345 })
 * ```
 */
var transactions = function (host, params) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = host + "/transactions";
                if (params !== undefined)
                    url += "?" + (0, helpers_1.toQueryString)(params);
                return [4 /*yield*/, superagent_1["default"].get(url)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.body];
        }
    });
}); };
exports.transactions = transactions;
