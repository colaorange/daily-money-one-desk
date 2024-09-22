

import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, AccountTypeBalance, BookBalanceReport } from "@client/model";
import { Card, CardContent, CircularProgress, css } from "@mui/material";
import { BarChartProps, ChartsReferenceLine, ChartsXAxisProps, ChartsYAxisProps } from "@mui/x-charts";
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AssetLiabilityBalanceCardProps = PropsWithChildren<{
    report?: BookBalanceReport
}>

export const AssetLiabilityBalanceCard = observer(function AssetLiabilityBalanceCard({ report }: AssetLiabilityBalanceCardProps) {


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
        const assetBalance = accountTypes[AccountType.Asset] as AccountTypeBalance | undefined
        const liabilityBalance = accountTypes[AccountType.Liability] as AccountTypeBalance | undefined

        const assetAmount = !assetBalance ? 0 : (assetBalance.depositsAmount - assetBalance.withdrawalsAmount) * accountTypeFactor(AccountType.Asset)
        const liabilityAmount = !liabilityBalance ? 0 : (liabilityBalance.depositsAmount - liabilityBalance.withdrawalsAmount) * accountTypeFactor(AccountType.Liability)

        const dataset = [{
            type: 'amount',
            asset: assetAmount,
            liability: liabilityAmount
        }] as BarChartProps['dataset']


        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function accountTypeLabel(type: string) {
            return ll(`account.type.${type}`)
        }

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        const maxAmountTxtLength = Math.max(valueFormatter(assetAmount).length, valueFormatter(liabilityAmount).length)

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
                    max: assetAmount <= 0 && liabilityAmount <= 0 ? 100 : undefined
                } as ChartsYAxisProps
            ] as BarChartProps['yAxis'],
            series: [
                {
                    id: 'asset',
                    dataKey: 'asset',
                    label: accountTypeLabel('asset'),
                    valueFormatter,
                    color: colorScheme.asset,
                },
                {
                    id: 'liability',
                    dataKey: 'liability',
                    label: accountTypeLabel('liability'),
                    valueFormatter,
                    color: colorScheme.liability
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

export default AssetLiabilityBalanceCard