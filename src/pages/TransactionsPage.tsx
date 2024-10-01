import AppToolbar from "@/components/AppToolbar"
import BookSelect from "@/components/BookSelect"
import TimePeriodInfo from "@/components/TimePeriodInfo"
import TimePeriodPopoverButton from "@/components/TimePeriodPopoverButton"
import TimePeriodShiftButton from "@/components/TimePeriodShiftButton"
import { UnderConsturction } from "@/components/UnderContruction"
import { useAccountStore, useBookStore, useSharedStore } from "@/contexts/useStore"
import useTheme from "@/contexts/useTheme"
import MainTemplate from "@/templates/MainTemplate"
import { TimePeriod } from "@/types"
import utilStyles from "@/utilStyles"
import { Book } from "@client/model"
import { Divider } from "@mui/material"
import { observer } from "mobx-react-lite"
import { PropsWithChildren, useCallback, useEffect } from "react"

export type TransactionsPageProps = PropsWithChildren
/**
 * 
 * 
 */

export const TransactionsPage = observer(function AboutPage(props: TransactionsPageProps) {

    const { appStyles } = useTheme()

    const sharedStore = useSharedStore()
    const bookStore = useBookStore()
    const accountStore = useAccountStore()

    const { timePeriod } = sharedStore
    const { books, currentBookId } = bookStore
    const { accounts } = accountStore

    const onBookChange = useCallback((book?: Book) => {
        bookStore.currentBookId = book?.id
    }, [bookStore])

    const onTimePeriodChange = useCallback((timePeriod: TimePeriod) => {
        sharedStore.timePeriod = timePeriod
    }, [sharedStore])


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
        <AppToolbar sxGap={1}>
            <BookSelect bookId={currentBookId} books={books} onBookChange={onBookChange} css={appStyles.toolbarSelect} />
            <span css={utilStyles.flex1} />
            <TimePeriodInfo timePeriod={timePeriod} hideGranularity />
            <TimePeriodShiftButton varient="previousMonth" timePeriod={timePeriod} onShift={onTimePeriodChange} />
            <TimePeriodShiftButton varient="nextMonth" timePeriod={timePeriod} onShift={onTimePeriodChange} />
            <TimePeriodPopoverButton timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} hideGranularity />
        </AppToolbar>
        <Divider flexItem />
        <UnderConsturction />
    </MainTemplate>
})

export default TransactionsPage