/**
 * The base error type used when the client encounters abnormal status codes.
 */
export declare class HttpError extends Error {
    readonly code: number;
    readonly response?: ErrorResponse | undefined;
    constructor(message: string, code: number, response?: ErrorResponse | undefined);
}
/**
 * Thrown when the bearer token is malformed or missing.
 */
export declare class UnauthorizedError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * Thrown when a parameter or argument is invalid.
 */
export declare class BadRequestError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * Thrown when the bearer token is invalid, expired, or does not have the necessary permissions for the last request.
 */
export declare class AccessDeniedError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * Thrown when the requested resource or endpoint is not found. This isn't always thrown – some endpoints, such as
 * "look up a sale by code," will catch this error automatically and instead return `undefined`.
 */
export declare class NotFoundError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * Thrown when you're being rate limited. By default, clients automatically handle rate limits and will retry requests
 * after the limit expires. If you disable that option, then you will see these errors thrown instead.
 */
export declare class TooManyRequestsError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * Thrown when the API encounters a server error. There's likely an outage or maintenance.
 */
export declare class ServerError extends HttpError {
    constructor(response?: ErrorResponse);
}
/**
 * An optional object with more details on an HTTP error. These aren't always available.
 */
export interface ErrorResponse {
    error: string | number;
    description?: string;
    code?: string;
}
