import { Headers, RequestInit, Response } from 'node-fetch';
import { HttpError, BadRequestError, UnauthorizedError, AccessDeniedError, NotFoundError, TooManyRequestsError, ServerError } from './errors';
import * as FormData from 'form-data';
import { Client } from '../client';
import { AbortSignal } from 'node-fetch/externals';
import fetch from 'node-fetch';

export class HttpClient {

	private _client?: Client;

	public constructor(client?: Client) {
		this._client = client;
	}

	/**
	 * Performs a fetch request.
	 *
	 * @param options
	 */
	public async fetch<T>(options: EnvatoHttpRequest) : Promise<EnvatoHttpResponse<T>> {
		const startTime = Date.now();
		const response = await fetch(options.url, this._getRequestOptions(options));
		const status = response.status;

		// For now, we'll get the body as plaintext and parse the JSON ourselves.
		// This is required due to how we currently convert objects like timestamps to dates.
		const responseText = await response.text();
		const responseBody = this._parseResponseText(responseText);
		const responseTime = (Date.now() - startTime);

		// For successful requests, make sure we were able to parse the body successfully
		// We can't do this for erroneous requests because the API isn't guaranteed to return JSON
		if (status === 200 && typeof responseBody === 'undefined') {
			throw new Error('Failed to parse OK response');
		}

		return {
			request: options,
			status,
			error: this._getHttpError(status, response.statusText, responseBody),
			body: responseBody,
			headers: response.headers,
			took: responseTime
		};
	}

	/**
	 * Returns the fetch init object to use for the request.
	 *
	 * @param opts
	 */
	private _getRequestOptions(opts: EnvatoHttpRequest) {
		const compress = opts.options?.compress;
		const timeout = opts.options?.timeout;

		const init: RequestInit = {
			headers: this._getRequestHeaders(opts),
			compress: typeof compress !== 'undefined' ? compress : this._client?.options.http?.compress,
			timeout: typeof timeout !== 'undefined' ? timeout : this._client?.options.http?.timeout,
			signal: opts.options?.signal,
			method: opts.method
		};

		if (opts.form) {
			const form = new FormData();

			for (const key in opts.form) {
				form.append(key, opts.form[key]);
			}

			init.body = form;
			init.headers!['content-type'] = 'x-www-form-urlencoded';
		}

		return init;
	}

	/**
	 * Returns an object containing the request headers to use for the given request.
	 *
	 * @param options
	 */
	private _getRequestHeaders(options: EnvatoHttpRequest): RequestHeaders {
		const sourceHeaders = options.headers;
		const headers = {};

		// Copy headers and lowercase all keys
		if (typeof sourceHeaders === 'object') {
			for (const key in sourceHeaders) {
				headers[key.toLowerCase()] = sourceHeaders[key];
			}
		}

		// Add a default user agent if necessary
		if (!('user-agent' in headers) || !headers['user-agent']) {
			headers['user-agent'] = 'Envato.js (https://github.com/baileyherbert/envato.js)';
		}

		// Add some additional headers
		headers['x-client'] = 'envato.js';

		return headers;
	}

	/**
	 * Returns an `HttpError` instance for erroneous responses, or `undefined` for successful responses.
	 *
	 * @param status
	 * @param message
	 * @param body
	 */
	private _getHttpError(status: number, message: string, body: any) {
		switch (status) {
			case 200: return;
			case 400: return new BadRequestError(body);
			case 401: return new UnauthorizedError(body);
			case 403: return new AccessDeniedError(body);
			case 404: return new NotFoundError(body);
			case 429: return new TooManyRequestsError(body);
			case 500: return new ServerError(body);
			default: return new HttpError(message, status, body);
		}
	}

	/**
	 * Parses the given response text as JSON and converts timestamps into dates. Returns `undefined` if there is a
	 * parse error.
	 *
	 * @param data
	 */
	private _parseResponseText(data: string) {
		try {
			return JSON.parse(data, (key, value) => {
                let date !: Date;

                if ((key.endsWith('_at') || key.endsWith('_until') || key.startsWith('last_')) && value) {
					date = new Date(value);
				}
                else if ((key === 'month' || key === 'date') && value) {
					date = new Date(value);
				}

                if (date && date.toString() !== 'Invalid Date') {
					return date;
				}

                return value;
            });
		}
		catch (_) {
			return;
		}
	}

}

export interface EnvatoHttpRequest {
	/**
	 * The request URL.
	 */
	url: string;

	/**
	 * The request method.
	 * @default GET
	 */
	method?: RequestMethod;

	/**
	 * The headers to send with the request.
	 */
	headers: RequestHeaders;

	/**
	 * Optional form data to send with the request. If provided, the `Content-Type` will automatically be set to
	 * `x-www-form-urlencoded` and the form data will be encoded accordingly.
	 */
	form?: RequestForm;

	/**
	 * Optional fetch options. These will override client defaults if provided.
	 */
	options?: RequestOptions;
}

export interface EnvatoHttpResponse<T> {
	/**
	 * The options for this request.
	 */
	request: EnvatoHttpRequest;

	/**
	 * The status code for the request.
	 */
	status: number;

	/**
	 * For requests with an erroneous status code, this will contain an `HttpError` instance.
	 */
	error?: HttpError;

	/**
	 * The parsed body from the response.
	 */
	body: T;

	/**
	 * The response headers.
	 */
	headers: Headers;

	/**
	 * The number of milliseconds the request took to execute.
	 */
	took: number;
}

export interface EnvatoHttpOptions {
	/**
	 * The default timeout for requests in milliseconds, or `0` to disable.
	 * @default 0
	 */
	timeout: number;

	/**
	 * Whether or not to support gzip/deflate content encoding for requests.
	 * @default true
	 */
	compress: boolean;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type RequestForm = { [name: string]: any };
export type RequestHeaders = { [name: string]: string };
export type RequestOptions = EnvatoHttpOptions & {
	/**
	 * An optional abort signal for cancelling a request before it completes. This is preferred over `timeout`.
	 */
	signal?: AbortSignal | null;
};
