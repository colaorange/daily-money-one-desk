

import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { getMaxDigits, getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, AccountTypeBalance, BookBalanceReport } from "@client/model";
import { Card, CardContent, CircularProgress, css } from "@mui/material";
import { BarChartProps, ChartsReferenceLine, ChartsXAxisProps, ChartsYAxisProps } from "@mui/x-charts";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type IncomeExpenseBalanceCardProps = PropsWithChildren<{
    report?: BookBalanceReport
}>

export const IncomeExpenseBalanceCard = observer(function IncomeExpenseBalanceCard({ report }: IncomeExpenseBalanceCardProps) {


    const { colorScheme } = useTheme()
    const i18n = useI18n()

    const chartData = useMemo(() => {
        if (!report) {
            return undefined
        }
        const { book, accountTypes } = report
        const { language, label: ll } = i18n


        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits })

        //undefined when node tranaction in period
        const incomeBalance = accountTypes[AccountType.Income] as AccountTypeBalance | undefined
        const expenseBalance = accountTypes[AccountType.Expense] as AccountTypeBalance | undefined

        const incomeAmount = !incomeBalance ? 0 : (incomeBalance.depositsAmount - incomeBalance.withdrawalsAmount) * accountTypeFactor(AccountType.Income)
        const expenseAmount = !expenseBalance ? 0 : (expenseBalance.depositsAmount - expenseBalance.withdrawalsAmount) * accountTypeFactor(AccountType.Expense)

        const dataset = [{
            type: 'amount',
            income: incomeAmount,
            expense: expenseAmount
        }] as BarChartProps['dataset']


        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function accountTypeLabel(type: string) {
            return ll(`account.type.${type}`)
        }

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        const maxAmountTxtLength = Math.max(valueFormatter(incomeAmount).length, valueFormatter(expenseAmount).length)

        return {
            dataset,
            xAxis: [
                {
                    scaleType: 'band',
                    dataKey: 'type',
                    valueFormatter: () => '', //ll('balance.amount')
                    categoryGapRatio: 0.4,
                    barGapRatio: 0.6
                } as ChartsXAxisProps,
            ] as BarChartProps['xAxis'],
            yAxis: [
                {
                    label: currencySymbol,
                    max: incomeAmount <= 0 && expenseAmount <= 0 ? 100 : undefined
                } as ChartsYAxisProps
            ] as BarChartProps['yAxis'],
            series: [
                {
                    id: 'income',
                    dataKey: 'income',
                    label: accountTypeLabel('income'),
                    valueFormatter,
                    color: colorScheme.income,
                },
                {
                    id: 'expense',
                    dataKey: 'expense',
                    label: accountTypeLabel('expense'),
                    valueFormatter,
                    color: colorScheme.expense
                },
            ] as BarChartProps['series'],
            margin: {
                left: maxAmountTxtLength * 8 + 30
            },
            sx: {
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: `translate(-${maxAmountTxtLength * 8 - 25}px, 0)`,
                },
            }
        }
    }, [report, i18n, colorScheme])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vclayout, {
                minHeight: 300
            }),
            height: 300
        }
    }, [])

    return <Card>
        <CardContent css={styles.content}>
            {chartData ? <BarChart skipAnimation
                dataset={chartData.dataset}
                series={chartData.series}
                xAxis={chartData.xAxis}
                yAxis={chartData.yAxis}
                margin={chartData.margin}
                sx={chartData.sx}
                slotProps={{
                    legend: {
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 0,
                    },
                }}
                height={styles.height}
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

export default IncomeExpenseBalanceCard