/**
 * Wraps a promise that is looking for a resource, and catches any 404 Not Found errors. Instead of throwing a 404, it
 * resolves the promise with `undefined`. All other errors are thrown like normal.
 *
 * @param promise
 */
export declare function find<T>(promise: Promise<T>): Promise<T | undefined>;
