

import { accountTypeAreaColor, accountTypeFactor, accountTypeLineColor, toCurrencySymbol } from "@/appUtils";
import { FullLoading } from "@/components/FullLoading";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { InitialAccountTransDatetime } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimeGranularity, TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, Balance, BalanceReport, Book, BookGranularityBalanceReport } from "@client/model";
import { Card, CardContent, css, Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChartsReferenceLine, ChartsXAxisProps, ChartsYAxisProps, LineChartProps } from "@mui/x-charts";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';
import { observer } from "mobx-react-lite";
import moment from "moment";
import { PropsWithChildren, useMemo } from "react";

export type AccountTypesGranularityBalanceLineChartCardProps = PropsWithChildren<{
    book: Book
    accountTypes: AccountType[]

    timePeriod?: TimePeriod
    report?: BookGranularityBalanceReport
    refreshing?: boolean
    cumulative?: boolean
}>

type DatasetItem = {
    time?: number
} & {
    [key in AccountType]?: number
}

export const AccountTypesGranularityBalanceLineChartCard = observer(function AccountTypesGranularityBalanceLineChartCard({ book, report, accountTypes, timePeriod, refreshing, cumulative }: AccountTypesGranularityBalanceLineChartCardProps) {


    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { fixBalanceFractionDigits, monthFormat, dateFormat } = usePreferences() || {}

    const chartProps = useMemo(() => {
        if (!report || !timePeriod) {
            return undefined
        }
        const { reports } = report
        const { language, label: ll } = i18n

        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })

        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function accountTypeLabel(type: string) {
            return ll(`account.type.${type}`)
        }

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        let maxAmountTxtLength = 0
        let maxAccAmountTxtLength = 0
        const dataset = [] as LineChartProps['dataset']

        let initItem: DatasetItem
        const acculumulationItem: DatasetItem = {
            asset: 0,
            expense: 0,
            liability: 0,
            income: 0,
            other: 0,
        }

        Object.keys(reports).map((key) => {
            const report: BalanceReport = reports[key]

            const time = parseInt(key)
            const { accountTypes: reportAccountTypes } = report
            const accountTypeAmounts = accountTypes?.map((accountType) => {
                const balance = reportAccountTypes[accountType] as Balance | undefined
                const amount = !balance ? 0 : (balance.depositsAmount - balance.withdrawalsAmount) * accountTypeFactor(accountType)
                return { accountType, amount }
            })

            const item: DatasetItem = {
                time
            }
            accountTypeAmounts.forEach(({ accountType, amount }) => {
                maxAmountTxtLength = Math.max(maxAmountTxtLength, valueFormatter(amount).length)
                item[accountType] = amount

                //handle accumulation, pick first number or 0
                if (cumulative) {
                    const accAmount = ([acculumulationItem?.[accountType], initItem?.[accountType]].find((n) => n !== undefined) || 0) + amount
                    maxAccAmountTxtLength = Math.max(maxAccAmountTxtLength, valueFormatter(accAmount).length)
                    item[`${accountType}Accumulation`] = accAmount
                    acculumulationItem[accountType] = accAmount
                }
            })

            if (time === InitialAccountTransDatetime) {
                initItem = item
            } else {
                dataset?.push(item)
            }
        })

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
                cumulative ? {
                    id: 'accumulation',
                } as ChartsYAxisProps : undefined
            ].filter((a) => !!a) as LineChartProps['yAxis'],
            series: [...accountTypes.map((accountType) => {
                return {
                    yAxisId: 'amount',
                    dataKey: accountType,
                    label: accountTypeLabel(accountType),
                    valueFormatter,
                    color: accountTypeLineColor(accountType, colorScheme),
                }
            }), ...(cumulative ? accountTypes.map((accountType) => {
                return {
                    yAxisId: 'accumulation',
                    dataKey: `${accountType}Accumulation`,
                    label: accountTypeLabel(accountType) + '+',
                    valueFormatter,
                    color: accountTypeAreaColor(accountType, colorScheme),
                    area: true
                }
            }) : []) as LineChartProps['series']],
            margin: {
                //30 for y axis space
                left: (maxAmountTxtLength + 1) * 8 /* + 30 */,
                right: cumulative ? (maxAccAmountTxtLength + 1) * 8 : 8,
                top: 8,
                // bottom: 4,
            },
            sx: {
                //y axis label
                // [`.${axisClasses.left} .${axisClasses.label}`]: {
                //     //25 for y axis space
                //     transform: `translate(-${(maxAmountTxtLength + 1) * 8/* - 25*/}px, 0)`,
                // },
                // [`.${axisClasses.right} .${axisClasses.label}`]: {
                //     //25 for y axis space
                //     transform: `translate(${(maxAmountTxtLength + 1) * 8/* - 25*/}px, 0)`,
                // }
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
                    seriesToDisplay: accountTypes.map((accountType) => {
                        return {
                            id: accountType,
                            label: accountTypeLabel(accountType),
                            color: accountTypeLineColor(accountType, colorScheme),
                        }
                    })
                },
                axisContent: {
                    sx: {
                        ['.MuiChartsTooltip-valueCell']: {
                            textAlign: 'right'
                        }
                    }
                },
                noDataOverlay: { message: ll('noData') },
            } as LineChartProps['slotProps']
        }
    }, [book, report, cumulative, timePeriod, i18n, fixBalanceFractionDigits, accountTypes, dateFormat, monthFormat, colorScheme])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vlayout, appStyles.lineChart, {
                minHeight: 300,
                position: 'relative'
            }),
            header: css({
                gap: theme.spacing(1)
            }),
            height: 300
        }
    }, [theme, appStyles])

    return <Card>
        <CardContent css={styles.content}>
            <Stack direction='row' css={styles.header}>
                {book && <Typography variant="caption">{book.name}</Typography>}
                {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
            </Stack>
            {chartProps ? <LineChart skipAnimation
                dataset={chartProps.dataset}
                series={chartProps.series}
                xAxis={chartProps.xAxis}
                yAxis={chartProps.yAxis}
                margin={chartProps.margin}
                // sx={chartProps.sx}
                slotProps={chartProps.slotProps}
                height={styles.height}
                leftAxis='amount'
                rightAxis={cumulative ? 'accumulation' : undefined}
            >
                {chartProps.dataset?.length && chartProps.dataset?.length > 0 && <ChartsReferenceLine
                    y={0}
                    lineStyle={{ strokeDasharray: '10 5' }}
                    labelAlign="start"
                />}
            </LineChart> : <FullLoading />}
            {chartProps && refreshing && <FullLoading css={utilStyles.absoluteCenter} delay={400} />}
        </CardContent>
    </Card>
})

export default AccountTypesGranularityBalanceLineChartCard