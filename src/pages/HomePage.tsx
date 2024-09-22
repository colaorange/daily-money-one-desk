
import AppToolbar from "@/components/AppToolbar";
import BookSelect from "@/components/BookSelect";
import useStore, { useAccountStore, useBookStore, useReportStore } from "@/contexts/useStore";
import useTheme from "@/contexts/useTheme";
import MainTemplate from "@/templates/MainTemplate";
import utilStyles from "@/utilStyles";
import { AccountType, Book, BookBalanceReport } from "@client/model";
import { css, Divider, Grid2, Stack } from '@mui/material';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import AssetLiabilityBalanceCard from "./components/AssetLiabilityBalanceCard";
import { runAsync } from "@/utils";
import { errorHandler } from "@/appUtils";
import { ReportApi } from "@client/api";
import { ReportStore } from "@/stores/ReportStore";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import TimePeriodShiftButton from "@/components/TimePeriodShiftButton";
import TimePeriodPopoverButton from "@/components/TimePeriodPopoverButton";
import { TimePeriod } from "@/types";
import IncomeExpenseBalanceCard from "./components/IncomeExpanseBalanceCard";

export type HomePageProps = PropsWithChildren
/**
1. 目前資產及目前債務 (橫向條形圖（Horizontal Bar Chart）, Pie Chart) (1 row, 2 chart)
2. 本月(某月, 或過去N天)的每日支出 (bar, left), 累加支出(line, right)
3. 今年(某年) 的每月支出,收入 (bar), 累加支出收入(line, right)
3. 本月(某月)花費結構 (Pie Chart)
5. 本月(某月)收入結構 (Pie Chart)

 */

export const HomePage = observer(function HomePage(props: HomePageProps) {

    const { appStyles, theme } = useTheme()

    const { bookStore, accountStore, reportStore, sharedStore } = useStore()

    const [bookBalanceReport, setBookBalanceReport] = useState<BookBalanceReport>()

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
        bookStore.fetchBooks()
    }, [bookStore])

    useEffect(() => {
        accountStore.fetchAccounts()
    }, [accountStore])

    useEffect(() => {
        if (currentBookId && accounts) {
            runAsync(async () => {
                const report = await reportStore.reportBookBalance(currentBookId, {
                    accountTypes: [AccountType.Income, AccountType.Asset, AccountType.Expense, AccountType.Liability, AccountType.Other],
                    accountIds: accounts.filter((a) => a.bookId === currentBookId && !a.hidden).map((a) => a.id),
                    transDatetimeRange: {
                        from: (timePeriod.start === null || timePeriod.start < 0) ? -1 : timePeriod.start,
                        to: timePeriod.end
                    }
                })
                setBookBalanceReport(report)
            }, errorHandler())
        }
    }, [reportStore, currentBookId, accounts, timePeriod])

    const styles = useMemo(() => {
        return {
            container: css({
                margin: theme.spacing(1),
                alignSelf: 'stretch',
            }),
            card: css({

            }),
            mainTileSize: {
                sm: 12,
                md: 6,
                xl: 4
            }
        }
    }, [theme])

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
        <Grid2 container css={styles.container} spacing={1}>
            <Grid2 size={styles.mainTileSize}>
                <AssetLiabilityBalanceCard report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <IncomeExpenseBalanceCard report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <AssetLiabilityBalanceCard report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <AssetLiabilityBalanceCard report={bookBalanceReport} />
            </Grid2>
        </Grid2>
    </MainTemplate>
})

export default HomePage