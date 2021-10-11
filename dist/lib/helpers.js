"use strict";
exports.__esModule = true;
exports.urlsafe = exports.toQueryString = void 0;
var toQueryString = function (data) { return Object.keys(data)
    .map(function (key) { return key + "=" + (0, exports.urlsafe)(data[key]); })
    .join('&'); };
exports.toQueryString = toQueryString;
var urlsafe = function (v) {
    if (typeof v === 'string')
        return v.replace(/ /g, '%20');
    return "" + v;
};
exports.urlsafe = urlsafe;
