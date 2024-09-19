import { BookStore } from "@/stores/BookStore"
import { createContext, memo, PropsWithChildren, useMemo } from "react"
import useApi from "./useApi"

export type StoreProviderProps = PropsWithChildren

export type StoreContextValue = {
    bookStore: BookStore
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)
export const StoreProvider = memo(function StoreProvider({ children }: StoreProviderProps) {

    const api = useApi()
    const preferences = api.preferences

    const value = useMemo(() => {
        const configuration = api.configuration()
        const value: StoreContextValue | undefined = api ? {
            bookStore: new BookStore({
                configuration,
                currentBookId: preferences?.primaryBookId
            })
        } : undefined
        return value
    }, [api, preferences?.primaryBookId])

    return <StoreContext.Provider value={value} >
        {children}
    </StoreContext.Provider >
})

export default StoreProvider