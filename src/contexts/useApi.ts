import { Preferences, PublicSetting } from "@client/model"
import { useContext } from "react"
import { ApiContext, ApiContextValue } from "./ApiProvider"


export function useApi(): ApiContextValue {
    const context = useContext(ApiContext)
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider")
    }
    return context
}

export default useApi


export function usePublicSetting(): PublicSetting {
    return useApi().publicSetting
}

export function usePreferences(): Preferences | undefined {
    return useApi().preferences
}
