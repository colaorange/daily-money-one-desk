import { UnderConsturction } from "@/components/UnderContruction"
import { useAccountStore, useBookStore } from "@/contexts/useStore"
import MainTemplate from "@/templates/MainTemplate"
import { observer } from "mobx-react-lite"
import { PropsWithChildren, useEffect } from "react"

export type SearchTransactionsPageProps = PropsWithChildren

export const SearchTransactionsPage = observer(function AboutPage(props: SearchTransactionsPageProps) {

    const bookStore = useBookStore()
    const accountStore = useAccountStore()

    const { books } = bookStore
    const { accounts } = accountStore

    useEffect(() => {
        if (!books) {
            bookStore.fetchBooks()
        }
    }, [bookStore, books])
    useEffect(() => {
        if (!accounts) {
            accountStore.fetchAccounts()
        }
    }, [accountStore, accounts])

    return <MainTemplate>
        <UnderConsturction />
    </MainTemplate>
})

export default SearchTransactionsPage