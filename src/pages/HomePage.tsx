
import AppToolbar from "@/components/AppToolbar";
import BookSelect from "@/components/BookSelect";
import { useAccountStore, useBookStore } from "@/contexts/useStore";
import useTheme from "@/contexts/useTheme";
import MainTemplate from "@/templates/MainTemplate";
import utilStyles from "@/utilStyles";
import { Book } from "@client/model";
import { Divider, Stack } from '@mui/material';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback, useEffect } from "react";

export type HomePageProps = PropsWithChildren
/**
1. 目前資產及目前債務 (橫向條形圖（Horizontal Bar Chart）, Pie Chart) (1 row, 2 chart)
2. 本月(某月, 或過去N天)的每日支出 (bar, left), 累加支出(line, right)
3. 今年(某年) 的每月支出,收入 (bar), 累加支出收入(line, right)
3. 本月(某月)花費結構 (Pie Chart)
5. 本月(某月)收入結構 (Pie Chart)

 */

export const HomePage = observer(function HomePage(props: HomePageProps) {

    const { appStyles } = useTheme()

    const bookStore = useBookStore()
    const accountStore = useAccountStore()
    
    const { books, currentBookId } = bookStore
    const { accounts } = accountStore

    const onBookChange = useCallback((book?: Book) => {
        bookStore.currentBookId = book?.id
    }, [bookStore])

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
        </AppToolbar>
        <Divider flexItem />
        <Stack direction={"column"}>


        </Stack>
    </MainTemplate>
})

export default HomePage