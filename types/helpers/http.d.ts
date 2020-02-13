import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpError } from './errors';
export declare class Http {
    static fetch<T>(options: FetchOptions): Promise<FetchResponse<T>>;
    private static _getHttpError;
    private static _decodeResponse;
    private static _applyUserAgent;
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
export declare type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export declare type RequestForm = {
    [name: string]: any;
};
declare type RequestHeaders = {
    [name: string]: string | undefined;
};
export {};
