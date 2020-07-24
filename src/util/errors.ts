import { HttpError } from '../helpers/errors';

/**
 * Wraps a promise that is looking for a resource, and catches any 404 Not Found errors. Instead of throwing a 404, it
 * resolves the promise with `undefined`. All other errors are thrown like normal.
 *
 * @param promise
 */
export function find<T>(promise: Promise<T>) : Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        promise.then(resolve, error => {
            if (error instanceof HttpError && error.code === 404) resolve(undefined);
            else reject(error);
        });
    });
}

/**
 * Wraps a promise that is looking up a purchase code, and catches any 404 or 422 errors. Instead of throwing an
 * exception, it resolves the promise with `undefined`. All other errors are thrown like normal.
 *
 * @param promise
 */
export function findPurchaseCode<T>(promise: Promise<T>) : Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        promise.then(resolve, error => {
            if (error instanceof HttpError && (error.code === 404 || error.code === 422)) resolve(undefined);
            else reject(error);
        });
    });
}

export default { find, findPurchaseCode };
