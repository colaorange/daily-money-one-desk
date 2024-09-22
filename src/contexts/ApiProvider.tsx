import { appErrMessage } from "@/appUtils"
import { InitError } from "@/components/InitError"
import { InitLoading } from "@/components/InitLoading"
import { logDebug } from "@/logger"
import { runAsync } from "@/utils"
import { BasicApi } from "@client/api"
import { Configuration } from "@client/configuration"
import { Preferences, PublicSetting } from "@client/model"
import { createContext, memo, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react"

export type ApiProviderProps = PropsWithChildren<{
    basePath: string
    custom?: boolean
}>

export type ApiContextValue = {
    basePath: string,
    custom?: boolean
    publicSetting: PublicSetting
    setAuhtorization: (authorization?: ApiAuthorization) => void
    authorized?: boolean
    preferences?: Preferences
    configuration(): Configuration
}

const SESSION_CONNECTION_TOKEN = "connectionToken"

export type ApiAuthorization = {
    connectionToken: string,
    preferences: Preferences
}

export const ApiContext = createContext<ApiContextValue | undefined>(undefined)
export const ApiProvider = memo(function ApiProvider({ basePath, custom: custom, children }: ApiProviderProps) {

    const [stateMix, setStateMix] = useState<{
        error?: string,
        setting?: PublicSetting,
        authorization?: ApiAuthorization
    }>()

    useEffect(() => {

        const sessionConnectionToken = sessionStorage.getItem(SESSION_CONNECTION_TOKEN)
        runAsync(async () => {
            const basicApi = new BasicApi(new Configuration({
                basePath
            }))
            const setting = (await basicApi.getPublicSetting()).data
            let connectionToken: string | undefined
            let preferences: Preferences | undefined
            if (sessionConnectionToken) {
                try {
                    const result = (await basicApi.authorize(sessionConnectionToken)).data
                    if (!result.error) {
                        preferences = (await new BasicApi(new Configuration({
                            basePath,
                            apiKey: sessionConnectionToken
                        })).getPreference()).data

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
                authorization: (connectionToken && preferences) ? {
                    connectionToken,
                    preferences
                } : undefined,
            })
        }, (err) => {
            setStateMix({
                error: `Error when requesting to API ${basePath} : ${appErrMessage(err).message}`
            })
        })
    }, [basePath])


    const configuration = useCallback(() => {
        return new Configuration({
            basePath,
            apiKey: stateMix?.authorization?.connectionToken
        })
    }, [basePath, stateMix])


    const value = useMemo(() => {
        const configuration = () => {
            return new Configuration({
                basePath,
                apiKey: stateMix?.authorization?.connectionToken
            })
        }
        const setAuhtorization = (authorization?: ApiAuthorization) => {
            setStateMix((state) => {
                if (authorization) {
                    sessionStorage.setItem(SESSION_CONNECTION_TOKEN, authorization.connectionToken)
                } else {
                    sessionStorage.removeItem(SESSION_CONNECTION_TOKEN)
                    //todo remove cache in session store
                }
                return { ...state, authorization }
            })
        }
        const value: ApiContextValue | undefined = stateMix?.setting ? {
            basePath,
            publicSetting: stateMix.setting,
            custom: custom,
            setAuhtorization,
            configuration,
            authorized: !!stateMix.authorization,
            preferences: stateMix.authorization?.preferences
        } : undefined
        return value
    }, [stateMix, basePath, custom])

    return stateMix ? (stateMix.error ? <InitError message={stateMix.error} /> : <ApiContext.Provider value={value} >
        {children}
    </ApiContext.Provider >) : <InitLoading />
})

export default ApiProvider