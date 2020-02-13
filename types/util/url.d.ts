export declare function build(path: string, params?: Params): string;
export declare function prepare(host: string, ...values: (string | number | boolean)[]): any;
export declare type Params = {
    [name: string]: string | number | boolean | undefined;
};
