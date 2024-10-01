import { BookStore } from "@/stores/BookStore"
import { createContext, memo, PropsWithChildren, useMemo } from "react"
import useApi from "./useApi"
import { AccountStore } from "@/stores/AccountStore"
import { SharedStore } from "@/stores/SharedStore"
import { ReportStore } from "@/stores/ReportStore"
import { CacheStore } from "@/stores/CacheStore"

export type StoreProviderProps = PropsWithChildren

export type StoreContextValue = {
    sharedStore: SharedStore
    bookStore: BookStore
    accountStore: AccountStore
    reportStore: ReportStore
    cacheStore: CacheStore
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)
export const StoreProvider = memo(function StoreProvider({ children }: StoreProviderProps) {

    const api = useApi()
    const preferences = api.preferences

    const value = useMemo(() => {
        const configuration = api.configuration()
        const value: StoreContextValue | undefined = api ? {
            sharedStore: new SharedStore(),
            bookStore: new BookStore({
                configuration,
                currentBookId: preferences?.primaryBookId
            }),
            accountStore: new AccountStore({
                configuration
            }),
            reportStore: new ReportStore({
                configuration
            }),
            cacheStore: new CacheStore()
        } : undefined
        return value
    }, [api, preferences?.primaryBookId])

    return <StoreContext.Provider value={value} >
        {children}
    </StoreContext.Provider >
})

export default StoreProvider