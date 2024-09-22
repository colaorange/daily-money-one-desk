import inspect from "browser-util-inspect"
import { ValidationError, Validator } from "jsonschema"
import { AppError, I18nLabel } from './types'
import { AccountType } from "@client/model"
import { I18nContextValue } from "./contexts/I18nProvider"


export function isReversedAccountType(type: AccountType): boolean {
    switch (type) {
        case AccountType.Income:
        case AccountType.Liability:
            return true
        case AccountType.Asset:
        case AccountType.Expense:
        case AccountType.Other:
        default:
            return false
    }
}

export function accountTypeFactor(type: AccountType): 1 | -1 {
    return isReversedAccountType(type) ? -1 : 1
}

export function toCurrencySymbol(i18n: I18nContextValue, currency: string) {
    if (currency) {
        const key = 'currency.' + currency
        if (i18n.hasLabel(key)) {
            return i18n.label(key)
        }
    }
    return ''
}

export function appErrMessage(error: any, label?: I18nLabel) {
    let errorMessage: string
    let errorUserMessage: string | undefined

    if (error instanceof AppError) {
        errorMessage = error.message
        if (error.userMessage && label) {
            errorUserMessage = label(error.userMessage.key, error.userMessage.args)
        }
    } else if (error instanceof Error || error.message) {
        errorMessage = error.message
    } else if (typeof error === 'string') {
        errorMessage = error
    } else {
        //#37 [TypeError: cyclical structure in JSON object] of realm object
        errorMessage = inspect(error, { depth: 2 })
    }

    return {
        errorMessage,
        errorUserMessage: errorUserMessage,
        message: errorUserMessage || errorMessage
    }
}
export function newValidator() {
    const schemaValidator = new Validator()
    schemaValidator.customFormats = {
        'not-blank': (input: any) => {
            if (typeof input === 'string') {
                return !!input.trim()
            }
            return true
        }
    }
    return schemaValidator
}

export const schemaValidator = newValidator()

export function validationLabel(label: I18nLabel, err: ValidationError) {
    const { name, argument } = err
    if (name === 'format') {
        return label(`validation.format.${argument}`)
    } else {
        return label(`validation.${name}`, { argument })
    }
}

export function errorHandler() {
    return (error: any) => {
        //TODO
        throw error
    }
}