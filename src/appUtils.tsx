import inspect from "browser-util-inspect"
import { ValidationError, Validator } from "jsonschema"
import { AppError, I18nLabel } from './types'



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