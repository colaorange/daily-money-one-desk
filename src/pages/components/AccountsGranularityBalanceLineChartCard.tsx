

import { accountTypeFactor, pickPaletteColor, toCurrencySymbol } from "@/appUtils";
import AccountsPopoverButton from "@/components/AccountsPopoverButton";
import { FullLoading } from "@/components/FullLoading";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { InitialAccountTransDatetime } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { AccumulationType, TimeGranularity, TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { Account, AccountType, BalanceReport, Book, BookGranularityBalanceReport } from "@client/model";
import { Card, CardContent, CardHeader, css, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChartsReferenceLine, chartsTooltipClasses, ChartsXAxisProps, ChartsYAxisProps, LineChartProps } from "@mui/x-charts";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import Color from "color";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { PropsWithChildren, useMemo, useState } from "react";

export type AccountsGranularityBalanceLineChartCardProps = PropsWithChildren<{
    book: Book
    accountType: AccountType
    bookAccounts: Account[]

    timePeriod?: TimePeriod
    report?: BookGranularityBalanceReport
    refreshing?: boolean
    accumulationType?: AccumulationType
}>

type DatasetItem = {
    time?: number
} & {
    [key: string]: number
}

export const AccountsGranularityBalanceLineChartCard = observer(function AccountsGranularityBalanceLineChartCard({ book, report, accountType, bookAccounts, timePeriod, refreshing, accumulationType }: AccountsGranularityBalanceLineChartCardProps) {

    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { language, label: ll } = i18n
    const { fixBalanceFractionDigits, monthFormat, dateFormat, hideEmptyBalance } = usePreferences() || {}

    const typeAccounts = useMemo(() => {
        return bookAccounts.filter((a) => a.type === accountType)
    }, [accountType, bookAccounts])

    const [specificAccountIds, setSpecificAccountIds] = useState<Set<string>>(new Set())

    const chartProps = useMemo(() => {
        if (!report || !timePeriod) {
            return undefined
        }
        const { reports } = report

        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })

        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        let maxAmountTxtLength = 0
        let maxAccAmountTxtLength = 0
        const dataset = [] as LineChartProps['dataset']

        let initItem: DatasetItem
        const accItem: DatasetItem = {
        }

        const accountIdsToShow = new Set<string>()

        Object.keys(reports).map((key) => {
            const report: BalanceReport = reports[key]

            const time = parseInt(key)
            const { accounts: reportAccounts } = report

            // const accountAmounts: { account: Account, amount: number }[] = []

            const item: DatasetItem = {
                time
            }

            typeAccounts.filter((a) => (specificAccountIds.size === 0 || specificAccountIds.has(a.id))).forEach((account) => {
                const accountBalance = reportAccounts[account.id]
                if (accountBalance) {
                    const amount = (accountBalance.depositsAmount - accountBalance.withdrawalsAmount) * accountTypeFactor(accountType)
                    // if !(account is hidden and amount is zero)
                    if (!(account.hidden && amount === 0)) {
                        accountIdsToShow.add(account.id)
                        item[account.id] = amount
                        maxAmountTxtLength = Math.max(maxAmountTxtLength, valueFormatter(amount).length)

                        //handle accumulation, pick first number or 0
                        if (accumulationType !== AccumulationType.NONE) {
                            if (time === InitialAccountTransDatetime && accumulationType !== AccumulationType.PLUS_INIT) {
                                //ignore init
                                return
                            }
                            const accAmount = (accItem?.[account.id] || 0) + amount
                            maxAccAmountTxtLength = Math.max(maxAccAmountTxtLength, valueFormatter(accAmount).length)
                            item[`${account.id}-Accumulation`] = accAmount
                            accItem[account.id] = accAmount
                        }
                    }
                } else if (!hideEmptyBalance && !account.hidden) {
                    accountIdsToShow.add(account.id)
                    item[account.id] = 0
                    if (accumulationType !== AccumulationType.NONE) {
                        if (time === InitialAccountTransDatetime && accumulationType !== AccumulationType.PLUS_INIT) {
                            //ignore init
                            return
                        }
                        const accAmount = (accItem?.[account.id] || 0)
                        item[`${account.id}-Accumulation`] = accAmount
                        accItem[account.id] = accAmount
                    }
                } else {
                    //prevent chart compaint not number type for empty filed in series
                    item[account.id] = 0
                    if (accumulationType !== AccumulationType.NONE) {
                        if (time === InitialAccountTransDatetime && accumulationType !== AccumulationType.PLUS_INIT) {
                            //ignore init
                            return
                        }
                        const accAmount = (accItem?.[account.id] || 0)
                        item[`${account.id}-Accumulation`] = accAmount
                        accItem[account.id] = accAmount
                    }
                }
            })

            if (time === InitialAccountTransDatetime) {
                initItem = item
            } else {
                dataset?.push(item)
            }
        })


        const accountsToShow = typeAccounts.filter((a) => {
            return accountIdsToShow.has(a.id)
        })

        if (accountsToShow.length === 0) {
            return null
        }

        const seriesColorProcessor = (color: string) => {
            return (colorScheme.dark ? Color(color).lighten(0.75) : Color(color).darken(0.6)).rgb().toString()
        }

        return {
            dataset,
            xAxis: [
                {
                    dataKey: 'time',
                    valueFormatter: (value: number, ctx: any) => {
                        const m = moment(value)
                        let label = ''
                        switch (timePeriod.granularity) {
                            case TimeGranularity.DAILY:
                                label = m.format(dateFormat)
                                break;
                            case TimeGranularity.MONTHLY:
                                label = m.format(monthFormat)
                                break;
                            case TimeGranularity.YEARLY:
                                label = m.format('YYYY')
                                break;
                        }
                        return ctx.location === 'tooltip' ? `${label} ${currencySymbol ? ` (${currencySymbol})` : ''}` : label
                    },
                } as ChartsXAxisProps,
            ] as LineChartProps['xAxis'],
            yAxis: [
                {
                    id: 'amount',
                } as ChartsYAxisProps,
                accumulationType !== AccumulationType.NONE ? {
                    id: 'accumulation',
                    label: ll(accumulationType === AccumulationType.NORAML ? 'desktop.accumulatedAmount' : 'desktop.initNAccumulatedAmount')
                } as ChartsYAxisProps : undefined
            ].filter((a) => !!a) as LineChartProps['yAxis'],
            series: [...accountsToShow.map((account, idx) => {
                return {
                    yAxisId: 'amount',
                    dataKey: account.id,
                    label: account.name,
                    valueFormatter,
                    color: pickPaletteColor(idx, colorScheme, seriesColorProcessor),
                }
            }), ...(accumulationType !== AccumulationType.NONE ? accountsToShow.map((account, idx) => {
                return {
                    yAxisId: 'accumulation',
                    dataKey: `${account.id}-Accumulation`,
                    label: account.name + (accumulationType === AccumulationType.PLUS_INIT ? '++' : '+'),
                    valueFormatter,
                    color: pickPaletteColor(idx, colorScheme),
                    area: true
                }
            }) : []) as LineChartProps['series']],
            margin: {
                //30 for y axis space
                left: (maxAmountTxtLength + 1) * 8 /* + 30 */,
                right: accumulationType !== AccumulationType.NONE ? (maxAccAmountTxtLength + 1) * 8 + 30 : 8,
                top: 8,
                // bottom: 4,
            },
            sx: {
                //y axis label
                // [`.${axisClasses.left} .${axisClasses.label}`]: {
                //     //25 for y axis space
                //     transform: `translate(-${(maxAmountTxtLength + 1) * 8/* - 25*/}px, 0)`,
                // },
                [`.${axisClasses.right} .${axisClasses.label}`]: {
                    //25 for y axis space
                    transform: `translate(${(maxAmountTxtLength + 1) * 8 - 25}px, 0)`,
                }
            } as SxProps<Theme>,
            slotProps: {
                legend: {
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                    itemMarkHeight: 14,
                    itemMarkWidth: 14,
                    labelStyle: {
                        fontSize: 16
                    },
                    //don't show accumulation in legend
                    seriesToDisplay: accountsToShow.map((account, idx) => {
                        return {
                            id: account.id,
                            label: account.name,
                            color: pickPaletteColor(idx, colorScheme, seriesColorProcessor)
                        }
                    })
                },
                axisContent: {
                    sx: {
                        [`.${chartsTooltipClasses.valueCell}`]: {
                            textAlign: 'right'
                        }
                    }
                },
                noDataOverlay: { message: ll('noData') },

            } as LineChartProps['slotProps']
        }
    }, [accountType, book.currency, book.fractionDigits, book.symbol, colorScheme, accumulationType, dateFormat, fixBalanceFractionDigits, hideEmptyBalance, i18n, language, ll, monthFormat, report, specificAccountIds, timePeriod, typeAccounts])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vlayout, appStyles.lineChart, {
                minHeight: 300,
                position: 'relative'
            }),
            header: css({
                gap: theme.spacing(1),
                justifyContent: 'center'
            }),
            checkbox: css({

            }),
            height: 300
        }
    }, [theme, appStyles])

    return <Card>
        <CardContent >
            <CardHeader title={
                <Stack direction='row' css={styles.header}>
                    {book && <Typography variant="caption">{book.name}</Typography>}
                    {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
                </Stack>}
                action={<AccountsPopoverButton accounts={typeAccounts} selectedAccountIds={specificAccountIds} disabled={refreshing} onSelectedAccountsChange={setSpecificAccountIds} />}
            />

            <Stack css={styles.content}>
                {chartProps === undefined && <FullLoading />}
                {chartProps === null && <Typography css={utilStyles.vclayout} flex={1}>{ll('noData')}</Typography>}
                {chartProps && <LineChart skipAnimation
                    colors={colorScheme.chartColorPalette}
                    dataset={chartProps.dataset}
                    series={chartProps.series}
                    xAxis={chartProps.xAxis}
                    yAxis={chartProps.yAxis}
                    margin={chartProps.margin}
                    sx={chartProps.sx}
                    slotProps={chartProps.slotProps}
                    height={styles.height}
                    leftAxis='amount'
                    rightAxis={accumulationType !== AccumulationType.NONE ? 'accumulation' : undefined}
                >
                    {chartProps.dataset?.length && chartProps.dataset?.length > 0 && <ChartsReferenceLine
                        y={0}
                        lineStyle={{ strokeDasharray: '10 5' }}
                        labelAlign="start"
                    />}
                </LineChart>}
                {refreshing && <FullLoading css={utilStyles.absoluteCenter} delay={400} />}
            </Stack>
        </CardContent>
    </Card >
})

export default AccountsGranularityBalanceLineChartCard