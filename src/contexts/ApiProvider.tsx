import { appErrMessage } from "@/appUtils"
import { InitError } from "@/components/InitError"
import { InitLoading } from "@/components/InitLoading"
import { logDebug } from "@/logger"
import { runAsync } from "@/util"
import { BasicApi } from "@client/api"
import { Configuration as ApiConfiguration } from "@client/configuration"
import { PublicSetting } from "@client/model"
import { createContext, memo, PropsWithChildren, useEffect, useMemo, useState } from "react"

export type ApiProviderProps = PropsWithChildren<{
    basePath: string
    custom?: boolean
}>

export type ApiContextValue = {
    basePath: string,
    custom?: boolean
    publicSetting: PublicSetting
    authorized?: boolean
    setConnectionToken: (connectionToken: string) => void
}

const SESSION_CONNECTION_TOKEN = "connectionToken"


export const ApiContext = createContext<ApiContextValue | undefined>(undefined)
export const ApiProvider = memo(function ApiProvider({ basePath, custom: custom, children }: ApiProviderProps) {

    const [stateMix, setStateMix] = useState<{
        error?: string,
        setting?: PublicSetting,
        connectionToken?: string,
    }>()

    useEffect(() => {

        const sessionConnectionToken = sessionStorage.getItem(SESSION_CONNECTION_TOKEN)
        runAsync(async () => {
            const basicApi = new BasicApi(new ApiConfiguration({
                basePath
            }))
            const setting = (await basicApi.getPublicSetting()).data
            let connectionToken: string | undefined

            if (sessionConnectionToken) {
                try {
                    const result = (await basicApi.authorize(sessionConnectionToken)).data
                    if (!result.error) {
                        connectionToken = sessionConnectionToken
                    } else {
                        sessionStorage.removeItem(SESSION_CONNECTION_TOKEN)
                        logDebug('Fail to authorize by session connection token ', result.message)
                    }
                } catch (err) {
                    logDebug('Fail to authorize by session connection token ', err)
                }
            }

            setStateMix({
                setting,
                connectionToken
            })
        }, (err) => {
            setStateMix({
                error: `Error when requesting to API ${basePath} : ${appErrMessage(err).message}`
            })
        })
    }, [basePath])


    const value = useMemo(() => {
        const setConnectionToken = (connectionToken: string) => {
            setStateMix((state) => {
                sessionStorage.setItem(SESSION_CONNECTION_TOKEN, connectionToken)
                return { ...state, connectionToken }
            })
        }
        const value: ApiContextValue | undefined = stateMix?.setting ? {
            basePath,
            publicSetting: stateMix.setting,
            setConnectionToken,
            authorized: !!stateMix?.connectionToken,
            custom: custom
        } : undefined
        return value
    }, [stateMix, basePath, custom])

    return stateMix ? (stateMix.error ? <InitError message={stateMix.error} /> : <ApiContext.Provider value={value} >
        {children}
    </ApiContext.Provider >) : <InitLoading />
})

export default ApiProvider