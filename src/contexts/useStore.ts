import { BookStore } from "@/stores/BookStore"
import { useContext } from "react"
import { StoreContext, StoreContextValue } from "./StoreProvider"


export function useStore(): StoreContextValue {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error("useStore must be used within an StoreProvider")
    }
    return context
}

export default useStore


export function useBookStore(): BookStore {
    return useStore().bookStore
}