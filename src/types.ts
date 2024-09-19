
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type UserMessage = {
    key: string
    args?: { [argKey: string]: any }
}

export type Verification = {
    valid: true
    message?: string
    userMessage?: UserMessage
} | {
    valid: false
    message: string
    userMessage?: UserMessage
}

export enum AdsLevel {
    SUPPORT = 1,
    LESS = 2,
    NONE = 3
}

export class AppError extends Error {

    readonly userMessage?: UserMessage
    readonly cause?: any

    constructor(message: string, userMessage?: UserMessage, cause?: any) {
        super(message)
        this.userMessage = userMessage
        this.cause = cause
    }
}

export type SortByDirection = 'asc' | 'desc' | undefined

export enum TimeGranularity {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export type TimePeriod = {
    start: number,
    end: number,
    granularity: TimeGranularity
}