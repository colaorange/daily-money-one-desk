
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
import { isEqual } from "lodash";
import moment from "moment";

export type HomePageProps = PropsWithChildren
/**
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
        if (!isEqual(sharedStore.timePeriod, timePeriod)) {
            sharedStore.timePeriod = timePeriod
        }
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
            fullTileSx: {
                height: {
                    xs: 0,
                    sm: 0,
                    md: 'auto',
                    xl: 'auto',
                },
                overflow: {
                    xs: 'hidden',
                    sm: 'hidden',
                    md: 'auto',
                    xl: 'auto',
                }
            },
        }
    }, [theme])

    const yearShift = timePeriod.start && Math.abs(moment(timePeriod.start).diff(timePeriod.end, 'day')) >= 364

    return <MainTemplate>
        <AppToolbar sxGap={1}>
            <BookSelect bookId={currentBookId} books={books} onBookChange={onBookChange} css={appStyles.toolbarSelect} disabled={processing} />
            <span css={utilStyles.flex1} />
            <TimePeriodInfo timePeriod={timePeriod} hideGranularity />
            <TimePeriodShiftButton varient={yearShift ? "previousYear" : "previousMonth"} timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodShiftButton varient={yearShift ? "nextYear" : "nextMonth"} timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodPopoverButton timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} hideGranularity disabled={processing} />
        </AppToolbar>
        <Divider flexItem />
        <Grid2 container css={styles.container} sx={styles.containerSx} spacing={2}>
            <Grid2 size={styles.fullTileSize} sx={styles.fullTileSx}>
                <AccountTypeBalanceCard timePeriod={timePeriod} accountTypes={[AccountType.Asset, AccountType.Liability, AccountType.Income, AccountType.Expense, AccountType.Other]} report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <AccountTypeBalanceCard timePeriod={timePeriod} accountTypes={[AccountType.Asset, AccountType.Liability]} report={bookBalanceReport} />
            </Grid2>
            <Grid2 size={styles.mainTileSize}>
                <AccountTypeBalanceCard timePeriod={timePeriod} accountTypes={[AccountType.Income, AccountType.Expense]} report={bookBalanceReport} />
            </Grid2>
        </Grid2>
    </MainTemplate>
})

export default HomePage