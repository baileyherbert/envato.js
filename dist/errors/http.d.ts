export declare class HttpError extends Error {
    readonly code: number;
    readonly response: ErrorResponse;
    constructor(message: string, code: number, response: ErrorResponse);
}
export declare class UnauthorizedError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare class BadRequestError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare class AccessDeniedError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare class NotFoundError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare class TooManyRequestsError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare class ServerError extends HttpError {
    constructor(response: ErrorResponse);
}
export declare type ErrorResponse = {
    error: string | number;
    description?: string;
    code?: string;
};
