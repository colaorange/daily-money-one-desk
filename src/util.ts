import { logError } from "./logger"


export async function runAsync<T, V>(fn: () => Promise<T>, handler?: (err: any) => V): Promise<T | V> {
    try {
        const r = await fn()
        return r
    } catch (err) {
        if (handler) {
            const v = handler(err)
            return v
        } else {
            logError('runAsync', err)
            throw err
        }
    }
}

/**
 * for typescript hint, as a object directly in code, for easy type checking
 */
export function hint<T>(value: T) {
    return value
}