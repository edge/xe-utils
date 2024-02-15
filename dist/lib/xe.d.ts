/**
 * Format mXE amount for display.
 * See `formatXe()` for further documentation.
 */
export declare function formatMxe(mxe: string | number, format: string | boolean): string;
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
export declare function format(xe: string | number, format: string | boolean): string;
/** Convert XE to mXE. */
export declare function toMxe(xe: string | number): number;
/** Convert mXE to XE. */
export declare function toXe(mxe: string | number): number;
