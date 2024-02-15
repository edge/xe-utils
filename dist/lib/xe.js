"use strict";
exports.__esModule = true;
exports.toXe = exports.toMxe = exports.format = exports.formatMxe = void 0;
/**
 * Format mXE amount for display.
 * See `formatXe()` for further documentation.
 */
function formatMxe(mxe, format) {
    var s = mxe.toString();
    var fraction = s.substring(s.length - 6).padStart(6, '0');
    var whole = s.substring(0, s.length - 6) || '0';
    if (format)
        whole = parseInt(whole).toLocaleString(typeof format === 'string' ? format : 'en-US');
    return "".concat(whole, ".").concat(fraction);
}
exports.formatMxe = formatMxe;
/**
 * Format XE amount for display.
 *
 * The `format` argument may be a locale string or a Boolean.
 * If it is `true` the amount is formatted using the `en-US` locale.
 * If it is `false` the amount is not formatted.
 *
 * Note that formatting only applies to the 'whole' XE amount.
 * mXE is always displayed with six decimal places.
 */
function format(xe, format) {
    return formatMxe(toMxe(xe), format);
}
exports.format = format;
/** Convert XE to mXE. */
function toMxe(xe) {
    if (typeof xe === 'string')
        xe = parseFloat(xe);
    return Math.floor(xe * 1e6);
}
exports.toMxe = toMxe;
/** Convert mXE to XE. */
function toXe(mxe) {
    if (typeof mxe === 'string')
        mxe = parseInt(mxe);
    return Math.floor(mxe) / 1e6;
}
exports.toXe = toXe;
