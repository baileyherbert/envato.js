import { HttpError } from '../errors/http';

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
