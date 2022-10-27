import { RequestCallback } from '.';
import { ResponseError } from 'superagent';
/**
 * An XE Client is any distributed app instance that can be uniquely identified by an XE address.
 * It may communicate with other XE Clients or externally operated servers.
 *
 * A given class of XE Client may operate behind the same hostname. For example, all Stargates run on
 * `stargate.edge.network` - but they must also be individually addressable by Edge systems.
 *
 * XE networking generally consists of two parts:
 *
 * 1. The Client sends a self-identification message to a Server
 * 2. The Server verifies and handles the message, and thereafter can send arbitrary messages to the Client
 *
 * In this library, a standard Client-to-Server network protocol is provided using JSON over HTTP.
 * This enables identification, verification, and subsequent status checks.
 * Further networking capabilities are specific to, and should be built into, the respective Client and Server
 * applications.
 */
export declare type Client = {
    /** XE address */
    address: string;
    /** Hostname */
    hostname: string;
    /** IP address */
    ip: string;
    /** Port */
    port: number;
    /** Secure (TLS) flag */
    secure: boolean;
    /** Authentication token */
    token: string;
};
/**
 * A Server is represented to a Client as methods for addressing it.
 *
 * Specifically, given an XE address, its methods return a tuples of request base URL and Host header value.
 */
export declare type Server = {
    /** Get URL to which to PUT a self-identification message. */
    identify: (address: string) => [string, string];
    /** Get URL to which a HEAD request can be sent to check status. */
    status: (address: string) => [string, string];
};
/**
 * A Host [base URL] can be expressed as a string or an object.
 *
 * The object form allows a different hostname (or Host header) to be used than is actually used in the request.
 * The example below is roughly equivalent to `curl -H 'Host: stargate.edge.network' 'https://1.2.3.4'`:
 *
 * ```json
 * { "address": "1.2.3.4", "host": "stargate.edge.network", "protocol": "https" }
 * ```
 *
 * See `parseHost()` for a standard parsing implementation.
 */
export declare type Host = string | {
    address: string;
    host: string;
    protocol: string;
};
/**
 * A self-identification message sent by a Client to a Server.
 */
export declare type Message = Pick<Client, 'address' | 'hostname' | 'port' | 'secure' | 'token'>;
/**
 * A receipt from a Server to acknowledge a Client message.
 * Whatever the Server does with the message, it will respond by mirroring the client's message plus its IP
 * address and remote status.
 */
export declare type Receipt = {
    client: Client;
    status: Status;
};
/**
 * Specialized Error class for network errors.
 * See `err()` and `extractError()` for more detail and typical usage advice.
 */
export declare class NetworkError extends Error {
    code: number;
    responseError?: ResponseError;
    constructor(code: number, message: string);
}
/**
 * A signed self-identification message sent by a Client to a Server.
 * It is signed using the XE private key corresponding to the Client's XE address.
 */
export declare type SignedMessage = Message & {
    signature: string;
};
/**
 * Client remote status, as reported by a Server.
 *
 * `online` and `offline` indicate the Server knows about this Client, most likely from previous connections.
 * `not found` means that it has never encountered the Client before.
 */
export declare type Status = 'not found' | 'offline' | 'online';
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
export declare const createServer: (host: Host, identifyPath: (address: string) => string, statusPath: (address: string) => string) => Server;
/**
 * This wrapper function provides convenience when handling network errors, specifically in HTTP responses (although
 * not exclusively Promises).
 * If an Error occurs, it is caught for processing; if it is a ResponseError, its response JSON is extracted.
 * The error message in the JSON is then thrown to the caller as an NetworkError in place of the ResponseError.
 * If it is not a ResponseError with a usable JSON body, the original Error is thrown again.
 * If there is no error, the expected result is returned as normal.
 */
export declare const err: <T>(result: T | Promise<T>, keepResponse?: boolean) => Promise<T>;
/**
 * Extract the JSON error message from a ResponseError and return a NetworkError.
 * The response body object should include a `message` string, i.e. `{"message":"something"}`.
 * If the response is not valid JSON or doesn't have a message, the original Error is returned.
 */
export declare const extractError: (err: unknown, keepResponse?: boolean) => unknown;
/**
 * Send a self-identification message from a Client to a Server.
 *
 * This method uses HTTP PUT.
 */
export declare const identify: (server: Server, msg: SignedMessage, cb?: RequestCallback) => Promise<Receipt>;
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
export declare const parseHost: (h: Host) => [string, string];
/**
 * Sign a Client message.
 */
export declare const sign: (privateKey: string, msg: Message) => SignedMessage;
/**
 * Get remote status of Client from a Server.
 *
 * This method uses HTTP HEAD.
 */
export declare const status: (server: Server, address: string, cb?: RequestCallback) => Promise<Status>;
/**
 * Verify a Client message.
 *
 * This checks that the message address is valid and that the signature corresponds to its private key.
 */
export declare const verify: (msg: SignedMessage) => void;
