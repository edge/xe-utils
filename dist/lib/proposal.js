"use strict";
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
exports.proposalByTx = exports.proposal = exports.hashable = exports.hash = void 0;
var crypto_js_1 = require("crypto-js");
var superagent_1 = __importDefault(require("superagent"));
/**
 * Get the ledger hash of a proposal by reference to its corresponding transaction and vars at the time thereof.
 */
var hash = function (tx, vars) {
    var _a = (0, exports.hashable)(tx, vars), message = _a[1];
    return (0, crypto_js_1.SHA256)(message).toString();
};
exports.hash = hash;
/**
 * Prepare a Hashable object and message.
 *
 * Normally, user code should just use `hash()`.
 */
var hashable = function (tx, vars) {
    if (tx.data.action !== 'create_proposal')
        throw new Error('incorrect action');
    if (!tx.data.content)
        throw new Error('missing content');
    var ha = {
        created: tx.timestamp,
        duration: vars.proposal_duration,
        transaction: tx.hash,
        content: tx.data.content
    };
    return [ha, JSON.stringify(ha)];
};
exports.hashable = hashable;
/**
 * Get a proposal by its hash.
 *
 * ```
 * const myProposal = await proposal('https://api.xe.network', 'my-hash')
 * ```
 */
var proposal = function (host, hash, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/proposal/").concat(hash);
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
exports.proposal = proposal;
/**
 * Get a proposal by wallet address and transaction hash.
 * This can be useful if the proposal hash is not available.
 *
 * ```
 * const myProposal = await proposalByTx('https://api.xe.network' 'my-wallet-address', 'my-hash')
 * ```
 */
var proposalByTx = function (host, address, hash, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/proposals/").concat(address, "/").concat(hash);
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
exports.proposalByTx = proposalByTx;
