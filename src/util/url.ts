import * as querystring from 'querystring';
import { format } from 'util';

export function build(path: string, params: Params = {}) {
    let filtered : Params = {};

    for (let name in params) {
        if (typeof params[name] !== 'undefined') {
            let value = params[name];
            if (typeof value === 'boolean') value = value ? 'true' : 'false';

            filtered[name] = value;
        }
    }

    return path + '?' + querystring.stringify(filtered);
}

export function prepare(host: string, ...values: (string | number | boolean)[]) {
    values = values.filter(v => typeof v !== 'undefined');
    values = values.map(v => {
        if (typeof v === 'string') {
            return querystring.escape(v);
        }

        if (typeof v === 'boolean') {
            return v ? 'true' : 'false';
        }

        return v;
    });

    values.unshift(host);

    return format.apply(this, values);
}

export type Params = { [name: string] : string | number | boolean | undefined };
