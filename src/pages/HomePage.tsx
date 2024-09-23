
import { errorHandler } from "@/appUtils";
import AppToolbar from "@/components/AppToolbar";
import BookSelect from "@/components/BookSelect";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import TimePeriodPopoverButton from "@/components/TimePeriodPopoverButton";
import TimePeriodShiftButton from "@/components/TimePeriodShiftButton";
import useStore from "@/contexts/useStore";
import useTheme from "@/contexts/useTheme";
import MainTemplate from "@/templates/MainTemplate";
import { TimePeriod } from "@/types";
import { runAsync } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, Book, BookBalanceReport } from "@client/model";
import { css, Divider, Grid2, SxProps, Theme } from '@mui/material';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import AccountTypeBalanceCard from "./components/AccountTypeBalanceCard";

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

    const [processing, setProcessing] = useState<boolean>()

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
            setProcessing(true)
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
            }, errorHandler()).finally(() => {
                setProcessing(false)
            })
        }
    }, [reportStore, currentBookId, accounts, timePeriod])

    const styles = useMemo(() => {
        return {
            container: css({
                alignSelf: 'stretch',
            }),
            containerSx: {
                margin: {
                    xs: theme.spacing(2, 4),
                    sm: theme.spacing(2, 4),
                    md: theme.spacing(2),
                    xl: theme.spacing(2),
                },
            } as SxProps<Theme>,
            mainTileSize: {
                xs: 12,
                sm: 12,
                md: 6,
                xl: 4
            },
            fullTileSize: {
                xs: 12,
                sm: 12,
                md: 12,
                xl: 12
            },
        }
    }, [theme])

    return <MainTemplate>
        <AppToolbar sxGap={1}>
            <BookSelect bookId={currentBookId} books={books} onBookChange={onBookChange} css={appStyles.toolbarSelect} disabled={processing} />
            <span css={utilStyles.flex1} />
            <TimePeriodInfo timePeriod={timePeriod} hideGranularity />
            <TimePeriodShiftButton varient="previousMonth" timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodShiftButton varient="nextMonth" timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodPopoverButton timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} hideGranularity disabled={processing} />
        </AppToolbar>
        <Divider flexItem />
        <Grid2 container css={styles.container} sx={styles.containerSx} spacing={2}>
            {/* <Grid2 size={styles.fullTileSize}>
                <AccountTypeBalanceCard accountTypes={[AccountType.Asset, AccountType.Liability, AccountType.Income, AccountType.Expense, AccountType.Other]} report={bookBalanceReport} />
            </Grid2> */}
            <Grid2 size={styles.mainTileSize}>
                <AccountTypeBalanceCard accountTypes={[AccountType.Asset, AccountType.Liability]} report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <AccountTypeBalanceCard accountTypes={[AccountType.Income, AccountType.Expense]} report={bookBalanceReport} />
            </Grid2>

        </Grid2>
    </MainTemplate>
})

export default HomePage