


export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

export type ExtensionLogger = {
    (level: LogLevel, ...data: any[]): void
}

let extensionLogger: ExtensionLogger | undefined


export const logInfo = (...data: any[]) => {
    console.info(`[DMD]>`, ...data)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    extensionLogger && extensionLogger(LogLevel.INFO, ...data)
}
export const logError = (...data: any[]) => {
    console.error(`[DMD]>`, ...data)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    extensionLogger && extensionLogger(LogLevel.ERROR, ...data)
}
export const logWarn = (...data: any[]) => {
    console.warn(`[DMD]>`, ...data)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    extensionLogger && extensionLogger(LogLevel.WARN, ...data)
}
export const logDebug = (...data: any[]) => {
    console.debug(`[DMD]>`, ...data)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    extensionLogger && extensionLogger(LogLevel.DEBUG, ...data)
}

export function setExtensionLogger(logger: ExtensionLogger) {
    extensionLogger = logger
}

export function getExtensionLogger() {
    return extensionLogger
}
