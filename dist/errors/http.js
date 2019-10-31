"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message, code, response) {
        super(message);
        this.code = code;
        this.response = response;
    }
}
exports.HttpError = HttpError;
class UnauthorizedError extends HttpError {
    constructor(response) {
        super('Unauthorized', 401, response);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class BadRequestError extends HttpError {
    constructor(response) {
        super('Bad Request', 400, response);
    }
}
exports.BadRequestError = BadRequestError;
class AccessDeniedError extends HttpError {
    constructor(response) {
        super('Access Denied', 403, response);
    }
}
exports.AccessDeniedError = AccessDeniedError;
class NotFoundError extends HttpError {
    constructor(response) {
        super('Not Found', 404, response);
    }
}
exports.NotFoundError = NotFoundError;
class TooManyRequestsError extends HttpError {
    constructor(response) {
        super('Too Many Requests', 429, response);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class ServerError extends HttpError {
    constructor(response) {
        super('Server Error', 500, response);
    }
}
exports.ServerError = ServerError;
