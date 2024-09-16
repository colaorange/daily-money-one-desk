import { appErrMessage } from "@/appUtils"
import { InitError } from "@/components/InitError"
import { InitLoading } from "@/components/InitLoading"
import { runAsync } from "@/util"
import { BasicApi } from "@client/api"
import { Configuration as ApiConfiguration } from "@client/configuration"
import { PublicSetting } from "@client/model"
import { createContext, memo, PropsWithChildren, useEffect, useMemo, useState } from "react"
import I18nProvider from "./I18nProvider"



export type ApiProviderProps = PropsWithChildren<{
    basePath: string
    custom?: boolean
}>

export type ApiContextValue = {
    basePath: string,
    publicSetting: PublicSetting
    custom?: boolean
}

export const ApiContext = createContext<ApiContextValue | undefined>(undefined)
export const ApiProvider = memo(function ApiProvider({ basePath, custom, children }: ApiProviderProps) {

    const [stateMix, setStateMix] = useState<{
        error?: string,
        setting?: PublicSetting
    }>()

    useEffect(() => {
        runAsync(async () => {
            const api = new BasicApi(new ApiConfiguration({
                basePath
            }))
            const setting = (await api.getPublicSetting()).data
            setStateMix({
                setting
            })
        }, (err) => {
            setStateMix({
                error: appErrMessage(err).message
            })
        })
    }, [basePath])


    const value = useMemo(() => {
        const value: ApiContextValue | undefined = stateMix?.setting ? {
            basePath,
            publicSetting: stateMix.setting,
            custom
        } : undefined
        return value
    }, [basePath, stateMix?.setting, custom])

    return stateMix ? (stateMix.error ? <InitError message={stateMix.error} /> : <ApiContext.Provider value={value} >
        {children}
    </ApiContext.Provider >) : <InitLoading />
})

export default ApiProvider