

import { accountTypeBarColor, accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import { FullLoading } from "@/components/FullLoading";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, Balance, Book, BookBalanceReport } from "@client/model";
import { Card, CardContent, css, Stack, SxProps, Theme, Typography } from "@mui/material";
import { BarChartProps, ChartsReferenceLine, chartsTooltipClasses, ChartsXAxisProps, ChartsYAxisProps } from "@mui/x-charts";
import { BarChart, BarItem } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountTypesBalanceBarChartCardProps = PropsWithChildren<{
    book: Book
    accountTypes: AccountType[]

    timePeriod?: TimePeriod
    report?: BookBalanceReport
    refreshing?: boolean
}>

export const AccountTypesBalanceBarChartCard = observer(function AccountTypeBalanceCard({ book, report, accountTypes, timePeriod, refreshing }: AccountTypesBalanceBarChartCardProps) {


    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { language, label: ll } = i18n
    const { fixBalanceFractionDigits } = usePreferences() || {}

    const chartProps = useMemo(() => {

        if (!book || !report) {
            return undefined
        }

        const { accountTypes: reportAccountTypes } = report
        
        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })


        //undefined when node tranaction in period

        const accountTypeAmounts = accountTypes?.map((accountType) => {
            const balance = reportAccountTypes[accountType] as Balance | undefined
            const amount = !balance ? 0 : (balance.depositsAmount - balance.withdrawalsAmount) * accountTypeFactor(accountType)
            return { accountType, amount }
        })

        const dataset = [{
            type: 'amount'
        }] as BarChartProps['dataset']


        accountTypeAmounts.forEach(({ accountType, amount }) => {
            dataset![0][accountType] = amount
        })

        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function accountTypeLabel(type: string) {
            return ll(`account.type.${type}`)
        }

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        const maxAmountTxtLength = Math.max(...accountTypeAmounts.map(({ amount }) => valueFormatter(amount).length))

        return {
            dataset,
            xAxis: [
                {
                    scaleType: 'band',
                    dataKey: 'type',
                    valueFormatter: (value: number, ctx: any) => {
                        return ctx.location === 'tooltip' ? `${ll('balance.amount')}${currencySymbol ? ` (${currencySymbol})` : ''}` : ''
                    },
                } as ChartsXAxisProps,
            ] as BarChartProps['xAxis'],
            yAxis: [
                {
                    //don't show to save y axis space
                    // label: currencySymbol,
                } as ChartsYAxisProps
            ] as BarChartProps['yAxis'],
            series: accountTypeAmounts.map(({ accountType }) => {
                return {
                    id: accountType,
                    dataKey: accountType,
                    label: accountTypeLabel(accountType),
                    valueFormatter,
                    color: accountTypeBarColor(accountType, colorScheme),
                }
            }) as BarChartProps['series'],
            barLabel: (barItem: BarItem) => {
                // return accountTypeLabel(barItem.seriesId as any) + '\n' + 
                return valueFormatter(barItem.value || 0)
            },
            margin: {
                //30 for y axis space
                left: (maxAmountTxtLength + 1) * 8 /* + 30 */,
                right: 4,
                top: 8,
                // bottom: 4,
            },
            sx: {
                // y axis label
                // [`.${axisClasses.left} .${axisClasses.label}`]: {
                //     //25 for y axis space
                //     transform: `translate(-${(maxAmountTxtLength + 1) * 8/* - 25*/}px, 0)`,
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
                    }
                },
                axisContent: {
                    sx: {
                        [`.${chartsTooltipClasses.valueCell}`]: {
                            textAlign: 'right'
                        }
                    }
                },
                noDataOverlay: { message: ll('noData') },
            } as BarChartProps['slotProps']
        }
    }, [book, report, language, fixBalanceFractionDigits, accountTypes, i18n, ll, colorScheme])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vlayout, appStyles.barChart, {
                minHeight: 300,
                position: 'relative'
            }),
            header: css({
                gap: theme.spacing(1),
                justifyContent: 'center'
            }),
            height: 300
        }
    }, [theme, appStyles])

    return <Card>
        <CardContent>
            <Stack direction='row' css={styles.header}>
                {book && <Typography variant="caption">{book.name}</Typography>}
                {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
            </Stack>
            <Stack css={styles.content}>
                {chartProps === undefined && <FullLoading />}
                {chartProps === null && <Typography css={utilStyles.vclayout} flex={1}>{ll('noData')}</Typography>}
                {chartProps && <BarChart skipAnimation
                    dataset={chartProps.dataset}
                    series={chartProps.series}
                    xAxis={chartProps.xAxis}
                    yAxis={chartProps.yAxis}
                    margin={chartProps.margin}
                    sx={chartProps.sx}
                    slotProps={chartProps.slotProps}
                    height={styles.height}
                    barLabel={chartProps.barLabel}
                >
                    <ChartsReferenceLine
                        y={0}
                        lineStyle={{ strokeDasharray: '10 5' }}
                        labelAlign="start"
                    />
                </BarChart>}
                {refreshing && <FullLoading css={utilStyles.absoluteCenter} delay={400} />}
            </Stack>
        </CardContent>
    </Card>
})

export default AccountTypesBalanceBarChartCard