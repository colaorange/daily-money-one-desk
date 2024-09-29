
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider"
import i18nextDefault, { i18n as I18nextInstance } from "i18next"
//it loads large data when use default directly
// import moment from 'moment-timezone'; 
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range';
import { PropsWithChildren, createContext, memo, useMemo } from "react"
import useApi from "./useApi"
import { I18nHasLabel, I18nLabel } from "@/types"
import { FirstDayOfWeek } from "@client/model"

import "@/moment-locale/zh"
import "moment/locale/bn"
import "moment/locale/de"
import "moment/locale/el"
import "moment/locale/es"
import "moment/locale/hu"
import "moment/locale/it"
import "moment/locale/ja"
import "moment/locale/ko"
import "moment/locale/pt"
import "moment/locale/ru"
import "moment/locale/th"
import "moment/locale/tr"
import "moment/locale/vi"
import "moment/locale/zh-cn"
import "moment/locale/zh-tw"


export type I18nTranslation = {
    (): {
        [key: string]: object
    }
}

export type I18nProviderProps = PropsWithChildren

export type I18nContextValue = {
    language: string,
    i18nextInstance: I18nextInstance
    label: I18nLabel
    hasLabel: I18nHasLabel
}

function handleI18nextLabel(i18next: I18nextInstance, key: string, args: any = {}) {
    const { returnObjects, ...other } = args
    const val = i18next.t(key, { returnObjects: true, ...other }) as any
    if (returnObjects || typeof val === 'string') {
        return val
    }
    return val['@'] || `[key:${key}]`
}

function i18nextLabel(i18next: I18nextInstance): I18nLabel {
    return (key: string, args?: NonNullable<unknown>) => {
        return handleI18nextLabel(i18next, key, args)
    }
}

function i18nextHasLabel(i18next: I18nextInstance): I18nHasLabel {
    return (key: string) => {
        return i18next.exists(key)
    }
}

function toMomentDow(firstDayOfWeek: FirstDayOfWeek) {
    switch (firstDayOfWeek) {
        case "Sun":
            return 0
        case "Mon":
            return 1
        case "Thu":
            return 2
        case "Wed":
            return 3
        case "Thr":
            return 4
        case "Fri":
            return 5
        case "Sat":
            return 6
    }
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export const I18nProvider = memo(function I18nProvider({ children }: I18nProviderProps) {
    const api = useApi()
    const { language, translation } = api.publicSetting
    const preferences = api.preferences

    const i18next = useMemo(() => {
        document.documentElement.lang = language

        const i18next = i18nextDefault.createInstance()

        i18next.init({
            //fix
            //i18next::pluralResolver: Your environment seems not to be Intl API compatible, 
            //use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling
            compatibilityJSON: 'v3',

            // no resource yet, set lng doesn't work here
            fallbackLng: false,

            returnObjects: true,
            missingKeyNoValueFallbackToKey: false,
            interpolation: {
                escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
            },
            //we don't use namespace, but we allow : in label key
            nsSeparator: false
        })

        i18next.addResourceBundle(language, 'translation', translation, false, true)

        i18next.changeLanguage(language)

        moment.locale(language)
        if(preferences){
            //use phone's timezone
            if(preferences?.timeZone){
                moment.tz.setDefault(preferences?.timeZone);
                //it is global, we don't need to take care this in moment every where
            }
            moment.updateLocale(language, {
                week: {
                    dow: toMomentDow(preferences.firstDayOfWeek)
                }
            })
        }

        return i18next


    }, [language, translation, preferences])


    const label: I18nLabel = useMemo(() => i18nextLabel(i18next), [i18next])
    const hasLabel: I18nHasLabel = useMemo(() => i18nextHasLabel(i18next), [i18next])

    const value = useMemo(() => {
        const value: I18nContextValue = { language, label, hasLabel, i18nextInstance: i18next, }
        return value
    }, [hasLabel, i18next, label, language])


    return <I18nContext.Provider value={value} >
        {/* for date picker */}
        <LocalizationProvider dateAdapter={AdapterMoment}>
            {children}
        </LocalizationProvider>
    </I18nContext.Provider>
})


export default I18nProvider