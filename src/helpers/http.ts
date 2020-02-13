import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { HttpError, BadRequestError, UnauthorizedError, AccessDeniedError, NotFoundError, TooManyRequestsError, ServerError } from './errors';

export class Http {

	public static async fetch<T>(options: FetchOptions) : Promise<FetchResponse<T>> {
		let { method, url, headers, form } = options;
		let data : string | undefined;

		// Encode any forms as a query string
		if (form) {
			data = stringify(form);
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		// Ensure there's a user agent
		this._applyUserAgent(headers);

		let validateStatus = () => true;
		let transformResponse = (data: any) => data.toString();
		let response = await axios({ ...options.axios, method, url, data, headers, validateStatus, transformResponse });
		let status = response.status;
		let body = this._decodeResponse(response.data);

		if (status === 200 && typeof body === 'undefined') {
			throw new Error('Error parsing OK response');
		}

		return {
			status: response.status,
			statusError: this._getHttpError(status, response.statusText, body),
			headers: response.headers,
			response,
			body
		};
	}

	private static _getHttpError(status: number, message: string, body: any) {
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

	private static _decodeResponse(data: string) {
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

	private static _applyUserAgent(headers: RequestHeaders) {
		for (let name in headers) {
			if (name.toLowerCase() === 'user-agent') {
				if (!headers[name]) {
					headers[name] = 'Envato.js (https://github.com/baileyherbert/envato.js)';
				}

				return headers;
			}
		}

		headers['User-Agent'] = 'Envato.js (https://github.com/baileyherbert/envato.js)';
		return headers;
	}

}

export interface FetchOptions {
	method?: RequestMethod;
	url: string;
	headers: RequestHeaders;
	form?: RequestForm;
	axios?: AxiosRequestConfig;
}

export interface FetchResponse<T> {
	status: number;
	statusError?: HttpError;
	body: T;
	headers: RequestHeaders;
	response: AxiosResponse<string>;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type RequestForm = { [name: string]: any };
type RequestHeaders = { [name: string]: string | undefined };
