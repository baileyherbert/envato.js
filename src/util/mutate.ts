export function scope<T extends Object, P extends keyof T>(property: P, o: T) {
    return o[property];
}

export default { scope };
