
import AppToolbar from "@/components/AppToolbar";
import BookSelect from "@/components/BookSelect";
import TimePeriodButton from "@/components/TimePeriodButton";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { useBookStore } from "@/contexts/useStore";
import useTheme from "@/contexts/useTheme";
import MainTemplate from "@/templates/MainTemplate";
import { TimeGranularity, TimePeriod } from "@/types";
import utilStyles from "@/utilStyles";
import { Book } from "@client/model";
import { Divider, Typography } from '@mui/material';
import { observer } from "mobx-react-lite";
import moment from "moment";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";

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

    const [timePeriod, setTimePeriod] = useState<TimePeriod>({
        start: moment().add(-1, 'month').add(1, 'day').valueOf(),
        end: moment().endOf('day').valueOf(),
        granularity: TimeGranularity.DAILY
    })

    const bookStore = useBookStore()
    const { books, currentBookId } = bookStore

    const onBookChange = useCallback((book?: Book) => {
        bookStore.currentBookId = book?.id
    }, [bookStore])

    const onTimePeriodChange = useCallback((timePeriod: TimePeriod) => {
        setTimePeriod(timePeriod)
    }, [])


    useEffect(() => {
        if (!books) {
            bookStore.fetchBooks()
        }
    }, [bookStore, books])


    return <MainTemplate>
        <AppToolbar sxGap={1}>
            <BookSelect bookId={currentBookId} books={books} onBookChange={onBookChange} css={appStyles.toolbarSelect} />
            <span css={utilStyles.flex1} />
            <TimePeriodInfo timePeriod={timePeriod} />
            <TimePeriodButton timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} />
        </AppToolbar>
        <Divider flexItem />
        <Typography>HomePage</Typography>
        <div style={{ height: '200vh' }} />
        {/* <Button onClick={() => { bookStore.increment() }}>Increment</Button>
        <Button onClick={() => { bookStore.decrement() }}>Decrement</Button>
        <Button onClick={() => {
            bookStore.count = 0
        }}>Reset</Button> */}
    </MainTemplate>
})

export default HomePage