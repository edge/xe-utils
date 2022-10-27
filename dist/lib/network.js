"use strict";
// Copyright (C) 2022 Edge Network Technologies Limited
// Use of this source code is governed by a GNU GPL-style license
// that can be found in the LICENSE.md file. All rights reserved.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.verify = exports.status = exports.sign = exports.parseHost = exports.identify = exports.extractError = exports.err = exports.createServer = exports.NetworkError = void 0;
var wallet_1 = require("./wallet");
var superagent_1 = __importDefault(require("superagent"));
/**
 * Specialized Error class for network errors.
 * See `err()` and `extractError()` for more detail and typical usage advice.
 */
var NetworkError = /** @class */ (function (_super) {
    __extends(NetworkError, _super);
    function NetworkError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = 'NetworkError';
        return _this;
    }
    return NetworkError;
}(Error));
exports.NetworkError = NetworkError;
/**
 * Client remote status map, keyed by HTTP status code.
 */
var statusMap = {
    200: 'online',
    404: 'not found',
    502: 'offline'
};
/**
 * Domain matching expression.
 * See `parseHost()` for usage.
 */
var urlRegexp = /^https?:\/\/([^/]+)/;
/**
 * Create a Server representation from a Host and path creation methods.
 *
 * For example:
 *
 * ```js
 * const myApp = createServer(
 *   'https://myapp.edge.network',
 *   address => `/clients/${address}`,
 *   address => `/clients/${address}/status`
 * )
 * ```
 */
var createServer = function (host, identifyPath, statusPath) {
    var _a = (0, exports.parseHost)(host), url = _a[0], header = _a[1];
    return {
        identify: function (address) { return ["".concat(url).concat(identifyPath(address)), header]; },
        status: function (address) { return ["".concat(url).concat(statusPath(address)), header]; }
    };
};
exports.createServer = createServer;
/**
 * This wrapper function provides convenience when handling network errors, specifically in HTTP responses (although
 * not exclusively Promises).
 * If an Error occurs, it is caught for processing; if it is a ResponseError, its response JSON is extracted.
 * The error message in the JSON is then thrown to the caller as an NetworkError in place of the ResponseError.
 * If it is not a ResponseError with a usable JSON body, the original Error is thrown again.
 * If there is no error, the expected result is returned as normal.
 */
var err = function (result, keepResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!(result instanceof Promise)) return [3 /*break*/, 2];
                return [4 /*yield*/, result];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [2 /*return*/, result];
            case 3:
                err_1 = _a.sent();
                throw (0, exports.extractError)(err_1, keepResponse);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.err = err;
/**
 * Extract the JSON error message from a ResponseError and return a NetworkError.
 * The response body object should include a `message` string, i.e. `{"message":"something"}`.
 * If the response is not valid JSON or doesn't have a message, the original Error is returned.
 */
var extractError = function (err, keepResponse) {
    var _a, _b;
    if (err instanceof Error) {
        var re = err;
        if ((_b = (_a = re.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.message) {
            var e = new NetworkError(re.response.status, re.response.body.message);
            if (keepResponse)
                e.responseError = re;
            return e;
        }
    }
    return err;
};
exports.extractError = extractError;
/**
 * Send a self-identification message from a Client to a Server.
 *
 * This method uses HTTP PUT.
 */
var identify = function (server, msg, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, url, header, req, res, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = server.identify(msg.address), url = _a[0], header = _a[1];
                req = superagent_1["default"].put(url).set('Host', header).send(msg);
                if (!(cb === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, req];
            case 1:
                _b = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, cb(req)];
            case 3:
                _b = _c.sent();
                _c.label = 4;
            case 4:
                res = _b;
                return [2 /*return*/, res.body];
        }
    });
}); };
exports.identify = identify;
/**
 * Parse a Host string or object to a tuple of request base URL and Host header value.
 *
 * For example:
 *
 * ```js
 * const host = {
 *   address: '1.2.3.4',
 *   host: 'stargate.edge.network',
 *   protocol: 'https'
 * }
 * const [url, header] = parseHost(host)
 * const data = await superagent.get(url).set("Host", header)
 * ```
 */
var parseHost = function (h) {
    var _a;
    if (typeof h === 'string')
        return [h, ((_a = h.match(urlRegexp)) === null || _a === void 0 ? void 0 : _a[1]) || ''];
    return ["".concat(h.protocol, "://").concat(h.address), h.host];
};
exports.parseHost = parseHost;
/**
 * Sign a Client message.
 */
var sign = function (privateKey, msg) {
    var message = JSON.stringify({
        hostname: msg.hostname,
        port: msg.port,
        secure: msg.secure,
        token: msg.token
    });
    var signature = (0, wallet_1.generateSignature)(privateKey, message);
    return __assign(__assign({}, msg), { signature: signature });
};
exports.sign = sign;
/**
 * Get remote status of Client from a Server.
 *
 * This method uses HTTP HEAD.
 */
var status = function (server, address, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, url, header, req, res, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = server.status(address), url = _a[0], header = _a[1];
                req = superagent_1["default"].head(url)
                    .set('Host', header)
                    .ok(function (res) { return res.status === 200 || res.status === 404 || res.status === 502; });
                if (!(cb === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, req];
            case 1:
                _b = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, cb(req)];
            case 3:
                _b = _c.sent();
                _c.label = 4;
            case 4:
                res = _b;
                return [2 /*return*/, statusMap[res.status]];
        }
    });
}); };
exports.status = status;
/**
 * Verify a Client message.
 *
 * This checks that the message address is valid and that the signature corresponds to its private key.
 */
var verify = function (msg) {
    if (!(0, wallet_1.validateAddress)(msg.address))
        throw new Error('invalid address');
    // verify signature
    var message = JSON.stringify({
        hostname: msg.hostname,
        port: msg.port,
        secure: msg.secure,
        token: msg.token
    });
    var signatureAddress = (0, wallet_1.deriveAddressFromSignedMessage)(message, msg.signature);
    if (signatureAddress !== msg.address)
        throw new Error('invalid signature');
};
exports.verify = verify;
