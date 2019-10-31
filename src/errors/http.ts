export class HttpError extends Error {
    public constructor(message: string, public readonly code: number, public readonly response: ErrorResponse) {
        super(message);
    }
}

export class UnauthorizedError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Unauthorized', 401, response);
    }
}

export class BadRequestError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Bad Request', 400, response);
    }
}

export class AccessDeniedError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Access Denied', 403, response);
    }
}

export class NotFoundError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Not Found', 404, response);
    }
}

export class TooManyRequestsError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Too Many Requests', 429, response);
    }
}

export class ServerError extends HttpError {
    public constructor(response: ErrorResponse) {
        super('Server Error', 500, response);
    }
}

export type ErrorResponse = {
    error: string | number;
    description ?: string;
    code ?: string;
}
