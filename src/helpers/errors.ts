/**
 * The base error type used when the client encounters abnormal status codes.
 */
export class HttpError extends Error {
    public constructor(message: string, public readonly code: number, public readonly response ?: ErrorResponse) {
        super(message);
        this.name = 'HttpError';
    }
}

/**
 * Thrown when the bearer token is malformed or missing.
 */
export class UnauthorizedError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Unauthorized', 401, response);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Thrown when a parameter or argument is invalid.
 */
export class BadRequestError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Bad Request', 400, response);
        this.name = 'BadRequestError';
    }
}

/**
 * Thrown when the bearer token is invalid, expired, or does not have the necessary permissions for the last request.
 */
export class AccessDeniedError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Access Denied', 403, response);
        this.name = 'AccessDeniedError';
    }
}

/**
 * Thrown when the requested resource or endpoint is not found. This isn't always thrown – some endpoints, such as
 * "look up a sale by code," will catch this error automatically and instead return `undefined`.
 */
export class NotFoundError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Not Found', 404, response);
        this.name = 'NotFoundError';
    }
}

/**
 * Thrown when you're being rate limited. By default, clients automatically handle rate limits and will retry requests
 * after the limit expires. If you disable that option, then you will see these errors thrown instead.
 */
export class TooManyRequestsError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Too Many Requests', 429, response);
        this.name = 'TooManyRequestsError';
    }
}

/**
 * Thrown when the API encounters a server error. There's likely an outage or maintenance.
 */
export class ServerError extends HttpError {
    public constructor(response ?: ErrorResponse) {
        super('Server Error', 500, response);
        this.name = 'ServerError';
    }
}
/**
 * Thrown when an error occurs while generating a token from OAuth.
 */
export class OAuthError extends Error {
    public constructor(message: string, public readonly http?: HttpError) {
        super(message);
        this.name = 'OAuthError';
    }
}

/**
 * An optional object with more details on an HTTP error. These aren't always available.
 */
export interface ErrorResponse {
    error: string | number;
    description ?: string;
    code ?: string;
}
