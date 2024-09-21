import { BookStore } from "@/stores/BookStore"
import { createContext, memo, PropsWithChildren, useMemo } from "react"
import useApi from "./useApi"
import { AccountStore } from "@/stores/AccountStore"
import { SharedStore } from "@/stores/SharedStore"

export type StoreProviderProps = PropsWithChildren

export type StoreContextValue = {
    sharedStore: SharedStore
    bookStore: BookStore
    accountStore: AccountStore
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
            })
        } : undefined
        return value
    }, [api, preferences?.primaryBookId])

    return <StoreContext.Provider value={value} >
        {children}
    </StoreContext.Provider >
})

export default StoreProvider