"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const util_1 = require("util");
function build(path, params = {}) {
    let filtered = {};
    for (let name in params) {
        if (typeof params[name] !== 'undefined') {
            let value = params[name];
            if (typeof value === 'boolean')
                value = value ? 'true' : 'false';
            filtered[name] = value;
        }
    }
    return path + '?' + querystring.stringify(filtered);
}
exports.build = build;
function prepare(host, ...values) {
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
    return util_1.format.apply(this, values);
}
exports.prepare = prepare;
