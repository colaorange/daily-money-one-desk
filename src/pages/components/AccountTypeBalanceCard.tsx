

import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, AccountTypeBalance, BookBalanceReport } from "@client/model";
import { Card, CardContent, CircularProgress, css, SxProps, Theme } from "@mui/material";
import { BarChartProps, ChartsReferenceLine, ChartsXAxisProps, ChartsYAxisProps } from "@mui/x-charts";
import { BarChart, BarItem } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountTypeBalanceCardProps = PropsWithChildren<{
    report?: BookBalanceReport
    accountTypes: AccountType[]
}>

export const AccountTypeBalanceCard = observer(function AccountTypeBalanceCard({ report, accountTypes }: AccountTypeBalanceCardProps) {


    const { colorScheme, appStyles } = useTheme()
    const i18n = useI18n()

    const chartProps = useMemo(() => {
        if (!report) {
            return undefined
        }
        const { book, accountTypes: reportAccountTypes } = report
        const { language, label: ll } = i18n


        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits })


        //undefined when node tranaction in period

        const accountTypeAmounts = accountTypes?.map((accountType) => {
            const balance = reportAccountTypes[accountType] as AccountTypeBalance | undefined
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
                    // label: currencySymbol,
                } as ChartsYAxisProps
            ] as BarChartProps['yAxis'],
            series: accountTypeAmounts.map(({ accountType }) => {
                return {
                    id: accountType,
                    dataKey: accountType,
                    label: accountTypeLabel(accountType),
                    valueFormatter,
                    color: colorScheme[`${accountType}Container`],
                }
            }) as BarChartProps['series'],
            barLabel: (barItem: BarItem) => {
                // return accountTypeLabel(barItem.seriesId as any) + '\n' + 
                return valueFormatter(barItem.value || 0)
            },
            margin: {
                left: maxAmountTxtLength * 8 /* + 30 */,
                right: 4,
                top: 8,
                // bottom: 4,
            },
            sx: {
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: `translate(-${maxAmountTxtLength * 8/* - 25*/}px, 0)`,
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
                    }
                },
                axisContent: {
                    sx: {
                        ['.MuiChartsTooltip-valueCell']: {
                            textAlign: 'right'
                        }
                    }
                },
                axisTickLabel: {
                }
            } as BarChartProps['slotProps'],
        }
    }, [report, i18n, accountTypes, colorScheme])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vclayout, appStyles.barChart, {
                minHeight: 300
            }),
            height: 300
        }
    }, [appStyles])

    return <Card>
        <CardContent css={styles.content}>
            {chartProps ? <BarChart skipAnimation
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
            </BarChart> : <CircularProgress />}
        </CardContent>
    </Card>
})

export default AccountTypeBalanceCard