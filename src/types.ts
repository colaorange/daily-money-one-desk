import type { Palette, Theme } from "@mui/material";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type AppTheme = {
    //customization
    palette: AppPalette
} & Theme

export type AppPalette = Palette & {
    //TODO
    // warn: string
    // warnContainer: string
    // onWarn: string
    // onWarnContainer: string

    // info: string
    // infoContainer: string
    // onInfo: string
    // onInfoContainer: string

    // income: string
    // incomeContainer: string
    // onIncome: string
    // onIncomeContainer: string
    // inverseIncome: string

    // asset: string
    // assetContainer: string
    // onAsset: string
    // onAssetContainer: string
    // inverseAsset: string

    // expense: string
    // expenseContainer: string
    // onExpense: string
    // onExpenseContainer: string
    // inverseExpense: string

    // liability: string
    // liabilityContainer: string
    // onLiability: string
    // onLiabilityContainer: string
    // inverseLiability: string

    // other: string
    // otherContainer: string
    // onOther: string
    // onOtherContainer: string
    // inverseOther: string
}

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
export type License = {
    license?: string,
    valid?: boolean
    licenseData?: LicenseData
}
export type LicenseData = {
    email?: string,
    deviceUid?: string,
    adFree?: boolean | number,
    [key: string]: number | boolean | string | undefined | null | LicenseItem
}
export type LicenseItem = {
    [key: string]: number | boolean | string | undefined | null | LicenseItem
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

export enum TransTimeRangeMode {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    UNTIL = 'until',
    INITIAL = 'initial',
}

export enum CustomMode {
    CUSTOM = 'custom'
}

export enum BalanceTimeRangeMode {
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    UNTIL = 'until'
}

export enum BalanceChartMode {
    BAR = 'bar',
    PIE = 'pie'
}

export type SortByDirection = 'asc' | 'desc' | undefined


export type AutoBackupDatabaseConfig = {
    enabled?: boolean
    intervalDays?: number,
    lastBackgroundDatetime?: number
    lastBackupDatetime?: number
    lastBackupName?: string
    lastBackupSize?: number
    retentionCount?: number
    retentionDays?: number
}

export type AutoUploadBackupConfig = {
    enabled?: boolean
    lastUploadedDatetime?: number
    lastUploadedName?: string
    lastUploadedSize?: number
}

export enum FirstDayOfWeek {
    SUN = 0,
    MON = 1,
    THU = 2,
    WED = 3,
    THR = 4,
    FRI = 5,
    SAT = 6
}

export type DisplayVariables = {
    spacing: number
}

export type DevOption = {
    testOn?: boolean
}

export type Preferences = {
    primaryBookId?: string
    dateFormat?: string
    timeFormat?: string
    firstDayOfWeek?: FirstDayOfWeek
    firstDateOfYear?: [number, number]
    displayVariables?: DisplayVariables
    devOption?: DevOption
}