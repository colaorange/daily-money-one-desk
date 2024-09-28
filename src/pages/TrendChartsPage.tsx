
import { defaultAccountTypeOrder, errorHandler } from "@/appUtils";
import AppToolbar from "@/components/AppToolbar";
import BookSelect from "@/components/BookSelect";
import { FullLoading } from "@/components/FullLoading";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import TimePeriodPopoverButton from "@/components/TimePeriodPopoverButton";
import TimePeriodShiftButton from "@/components/TimePeriodShiftButton";
import { usePreferences } from "@/contexts/useApi";
import { useI18nLabel } from "@/contexts/useI18n";
import useStore from "@/contexts/useStore";
import useTheme from "@/contexts/useTheme";
import MainTemplate from "@/templates/MainTemplate";
import { TimePeriod } from "@/types";
import { runAsync } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, Book, BookGranularityBalanceReport } from "@client/model";
import { css, Divider, FormControlLabel, Grid2, Stack, Switch, SxProps, Theme, Typography } from '@mui/material';
import { isEqual } from "lodash";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { Fragment, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import AccountTypesGranularityBalanceLineChartCard from "./components/AccountTypesGranularityBalanceLineChartCard";
import { InitialAccountTransDatetime } from "@/constants";

export type TrendPageProps = PropsWithChildren


export const TrendPage = observer(function TrendPage(props: TrendPageProps) {

    const { appStyles, theme } = useTheme()
    const ll = useI18nLabel()

    const [processing, setProcessing] = useState<boolean>()

    const { bookStore, accountStore, reportStore, sharedStore } = useStore()

    const [bookGranularityBalanceReport, setBookGranularityBalanceReport] = useState<BookGranularityBalanceReport>()

    const { timePeriod } = sharedStore
    const { books, currentBookId } = bookStore
    const { accounts } = accountStore

    const book = useMemo(() => {
        return books && books.find((b) => b.id === currentBookId)
    }, [books, currentBookId])

    const bookAccounts = useMemo(() => {
        return accounts && accounts.filter((a) => a.bookId === currentBookId)
    }, [accounts, currentBookId])

    const { balanceAccountTypeOrder } = usePreferences() || {}

    const [allOn, setAllOn] = useState<boolean>()
    const [accountTypesOn, setAccountTypesOn] = useState<Set<AccountType>>(new Set([balanceAccountTypeOrder?.[0] || AccountType.EXPENSE]))
    const [accumulationOn, setAccumulationOn] = useState<boolean>()

    const onToggleAccountTypesOn = useCallback((type: AccountType) => {
        setAccountTypesOn((s) => {
            const newS = new Set(s)
            if (newS.has(type)) {
                newS.delete(type)
            } else {
                newS.add(type)
            }
            return newS
        })
    }, [])

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
        if (currentBookId && accounts && timePeriod) {
            setProcessing(true)
            runAsync(async () => {
                const report = await reportStore.reportBookGranularityBalance(currentBookId, {
                    accountTypes: [AccountType.INCOME, AccountType.ASSET, AccountType.EXPENSE, AccountType.LIABILITY, AccountType.OTHER],
                    accountIds: accounts.filter((a) => a.bookId === currentBookId && !a.hidden).map((a) => a.id),
                    transDatetimeRange: {
                        from: (timePeriod.start === null || timePeriod.start < 0) ? InitialAccountTransDatetime : timePeriod.start,
                        to: timePeriod.end
                    },
                    granularity: timePeriod.granularity
                })

                setBookGranularityBalanceReport(report)
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
            titleBar: css({
                flexDirection: 'row',
                alignItems: 'center',
                flex: 'wrap',
                flexWrap: 'wrap',
                gap: theme.spacing(1),
                rowGap: theme.spacing(1),
                justifyContent: "flex-end"
            }),
            accountTypesTileSize: {
                xs: 12,
                sm: 12,
                md: 6,
                xl: 6
            },
            accountsTileSize: {
                xs: 12,
                sm: 12,
                md: 6,
                xl: 6
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
            <TimePeriodInfo timePeriod={timePeriod} />
            <TimePeriodShiftButton varient={yearShift ? "previousYear" : "previousMonth"} timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodShiftButton varient={yearShift ? "nextYear" : "nextMonth"} timePeriod={timePeriod} onShift={onTimePeriodChange} disabled={processing} />
            <TimePeriodPopoverButton timePeriod={timePeriod} onTimePeriodChange={onTimePeriodChange} disabled={processing} />
        </AppToolbar>
        <Divider flexItem />
        {book && bookAccounts ? <>
            <Grid2 container css={styles.container} sx={styles.containerSx} spacing={2}>
                <Grid2 size={12}>
                    <Stack css={styles.titleBar}>
                        <Typography variant="h5">{ll('desktop.accountTypeBalanceSheet')}</Typography>
                        <div css={utilStyles.flex1} />
                        <FormControlLabel
                            control={<Switch color="primary" checked={!!accumulationOn} onChange={() => { setAccumulationOn(!accumulationOn) }} />}
                            label={ll(`desktop.accumulatedAmount`)}
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            control={<Switch color="primary" checked={!!allOn} onChange={() => { setAllOn(!allOn) }} />}
                            label={ll(`desktop.allAccountTypes`)}
                            labelPlacement="bottom"
                        />
                    </Stack>
                </Grid2>
                {allOn && <Grid2 size={styles.fullTileSize} sx={styles.fullTileSx}>
                    <AccountTypesGranularityBalanceLineChartCard
                        book={book}
                        timePeriod={timePeriod}
                        accountTypes={[AccountType.ASSET, AccountType.LIABILITY, AccountType.INCOME, AccountType.EXPENSE, AccountType.OTHER]}
                        report={bookGranularityBalanceReport}
                        cumulative={accumulationOn}
                        refreshing={processing}
                    />
                </Grid2>}
                {!allOn && <>
                    <Grid2 size={styles.accountTypesTileSize}>
                        <AccountTypesGranularityBalanceLineChartCard
                            book={book}
                            timePeriod={timePeriod}
                            accountTypes={[AccountType.ASSET, AccountType.LIABILITY]}
                            report={bookGranularityBalanceReport}
                            cumulative={accumulationOn}
                            refreshing={processing}
                        />
                    </Grid2>
                    <Grid2 size={styles.accountTypesTileSize}>
                        <AccountTypesGranularityBalanceLineChartCard
                            book={book}
                            timePeriod={timePeriod}
                            accountTypes={[AccountType.INCOME, AccountType.EXPENSE]}
                            report={bookGranularityBalanceReport}
                            cumulative={accumulationOn}
                            refreshing={processing}
                        />
                    </Grid2>
                </>}
                <Grid2 size={12}>
                    <Divider flexItem />
                </Grid2>
                <Grid2 size={12}>
                    <Stack css={styles.titleBar}>
                        <Typography variant="h5">{ll('desktop.accountBalanceSheet')}</Typography>
                        <div css={utilStyles.flex1} />
                        <Stack direction={'row'}>
                            {(balanceAccountTypeOrder || defaultAccountTypeOrder).map((type) => {
                                return <Fragment key={type}>
                                    <FormControlLabel
                                        control={<Switch color="primary" checked={accountTypesOn.has(type)} onChange={() => { onToggleAccountTypesOn(type) }} />}
                                        label={ll(`account.type.${type}`)}
                                        labelPlacement="bottom"
                                    />
                                </Fragment>
                            })}
                        </Stack>
                    </Stack>
                </Grid2>
                {(balanceAccountTypeOrder || defaultAccountTypeOrder).filter((a) => accountTypesOn.has(a)).map((type) => {
                    return <Fragment key={type}>
                        {/* <Grid2 size={styles.accountsTileSize}>
                            <AccountsBalanceBarChartCard
                                book={book}
                                timePeriod={timePeriod}
                                accountType={type}
                                report={bookGranularityBalanceReport}
                                bookAccounts={bookAccounts}
                            />
                        </Grid2>
                        <Grid2 size={styles.accountsTileSize}>
                            <AccountsBalancePieChartCard
                                book={book}
                                timePeriod={timePeriod}
                                accountType={type}
                                report={bookGranularityBalanceReport}
                                bookAccounts={bookAccounts}
                            />
                        </Grid2> */}
                    </Fragment>
                })}
            </Grid2>
        </>: <FullLoading />}
    </MainTemplate>
})

export default TrendPage