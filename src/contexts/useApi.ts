import { useContext } from "react"
import { ApiContext, ApiContextValue } from "./ApiProvider"
import { PublicSetting } from "@client/model"


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