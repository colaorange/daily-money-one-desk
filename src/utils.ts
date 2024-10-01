import _ from "lodash"
import { logError, logWarn } from "./logger"


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


const numformatCache = new Map<string, Intl.NumberFormat>()

export function getNumberFormat(language: string = 'en', option: { maximumFractionDigits?: number, minimumFractionDigits?: number } = {}) {
    let { maximumFractionDigits: max, minimumFractionDigits: min } = option

    if (max) {
        if (max < 0) {
            max = 0
        } else if (max > 10) {
            max = 10
        }
    }
    if (min) {
        if (min < 0) {
            min = 0
        } else if (min > 10) {
            min = 10
        }
    }

    const key = `${language}?${max === undefined ? '' : `max=${max}`}&${min === undefined ? '' : `min=${min}`}`
    let numformat = numformatCache.get(key)

    if (!numformat) {
        try {
            numformat = new Intl.NumberFormat(language, { maximumFractionDigits: max, minimumFractionDigits: min })
        } catch (err) {
            logWarn(err)
            numformat = new Intl.NumberFormat('en', { maximumFractionDigits: max, minimumFractionDigits: min })
        }
        numformatCache.set(key, numformat)
    }
    return numformat
}

export function getMaxDigits(num: number): number {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}


export function sortObjectByKey(obj: any) {
    if (_.isArray(obj)) {
        return obj.map(sortObjectByKey);
    } else if (_.isObject(obj)) {
        return _(obj)
            .toPairs()
            .sortBy(0)
            .fromPairs()
            .mapValues(sortObjectByKey)
            .value();
    } else {
        return obj;
    }
}