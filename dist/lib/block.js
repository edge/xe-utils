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
exports.tip = exports.parent = exports.latest = exports.history = exports.genesis = exports.blocks = exports.block = void 0;
var superagent_1 = __importDefault(require("superagent"));
var helpers_1 = require("./helpers");
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
var block = function (host, ref, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/block/").concat(ref);
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
exports.block = block;
/**
 * Get blocks.
 *
 * ```
 * const blocks = await block.blocks('https://api.xe.network')
 * ```
 */
var blocks = function (host, params, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/blocks");
                if (params !== undefined)
                    url += "?".concat((0, helpers_1.toQueryString)(params));
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
exports.blocks = blocks;
/**
 * Get genesis block.
 *
 * ```
 * const genesisBlock = await block.genesis('https://api.xe.network')
 * ```
 */
var genesis = function (host, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/blocks/genesis");
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
exports.genesis = genesis;
/**
 * Get block history.
 *
 * ```
 * const hist = await block.history('https://api.xe.network')
 * ```
 */
var history = function (host, params, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/blocks/history");
                if (params !== undefined)
                    url += "?".concat((0, helpers_1.toQueryString)(params));
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
exports.history = history;
/**
 * Get latest blocks.
 *
 * ```
 * const latest = await block.latest('https://api.xe.network')
 * ```
 */
var latest = function (host, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/blocks/history");
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
exports.latest = latest;
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
var parent = function (host, hash, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/block/parent/").concat(hash);
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
exports.parent = parent;
/**
 * Get tip block.
 *
 * ```
 * const tip = await block.tip('https://api.xe.network')
 * ```
 */
var tip = function (host, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var url, req, res, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(host, "/blocks/tip");
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
exports.tip = tip;
