import { BookStore } from "@/stores/BookStore"
import { useContext } from "react"
import { StoreContext, StoreContextValue } from "./StoreProvider"
import { AccountStore } from "@/stores/AccountStore"
import { SharedStore } from "@/stores/SharedStore"


export function useStore(): StoreContextValue {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error("useStore must be used within an StoreProvider")
    }
    return context
}

export default useStore

export function useSharedStore(): SharedStore {
    return useStore().sharedStore
}
export function useBookStore(): BookStore {
    return useStore().bookStore
}
export function useAccountStore(): AccountStore {
    return useStore().accountStore
}