import AppToolbar from "@/components/AppToolbar"
import BookSelect from "@/components/BookSelect"
import { useBookStore } from "@/contexts/useStore"
import MainTemplate from "@/templates/MainTemplate"
import { Book } from "@client/model"
import { Divider, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { PropsWithChildren, useCallback, useEffect } from "react"

export type TrendChartsPageProps = PropsWithChildren

export const TrendChartsPage = observer(function TrendChartsPage(props: TrendChartsPageProps) {
    const bookStore = useBookStore()

    const { books, currentBookId } = bookStore
    useEffect(() => {
        if (!books) {
            bookStore.fetchBooks()
        }
    }, [bookStore, books])

    const onBookChange = useCallback((book?: Book) => {
        bookStore.currentBookId = book?.id
    }, [bookStore])

    return <MainTemplate>
        <AppToolbar >
            <BookSelect bookId={currentBookId} books={books} onChange={onBookChange} />
        </AppToolbar>
        <Divider flexItem />
        <Typography>TrendChartsPage</Typography>
    </MainTemplate>
})

export default TrendChartsPage