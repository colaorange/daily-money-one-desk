

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { Account, AccountType, BookBalanceReport } from "@client/model";
import { Card, CardContent, CircularProgress, css, Stack, SxProps, Theme, Typography } from "@mui/material";
import { BarChartProps, ChartsReferenceLine, ChartsXAxisProps } from "@mui/x-charts";
import { BarChart, BarItem } from '@mui/x-charts/BarChart';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountTypeBalanceBarChartCardProps = PropsWithChildren<{
    timePeriod?: TimePeriod
    report?: BookBalanceReport
    accountType: AccountType
    bookAccounts: Account[]
}>

export const AccountTypeBalanceBarChartCard = observer(function AccountTypeBalanceCard({ report, accountType, timePeriod, bookAccounts }: AccountTypeBalanceBarChartCardProps) {


    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { label: ll } = i18n
    const { fixBalanceFractionDigits, hideEmptyBalance } = usePreferences() || {}

    const chartProps = useMemo(() => {
        if (!report) {
            return undefined
        }
        const { book, accounts: reportAccounts } = report
        const { language } = i18n


        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })

        const accountAmounts: { account: Account, amount: number }[] = []

        bookAccounts.filter((a) => a.type === accountType).forEach((account) => {
            const accountBalance = reportAccounts[account.id]
            if (accountBalance) {
                const amount = (accountBalance.depositsAmount - accountBalance.withdrawalsAmount) * accountTypeFactor(accountType)
                // if !(account is hidden and amount is zero)
                if (!(account.hidden && amount === 0)) {
                    accountAmounts.push({
                        account: account,
                        amount
                    })
                }
            } else if (!hideEmptyBalance && !account.hidden) {
                accountAmounts.push({
                    account,
                    amount: 0
                })
            }
        })

        accountAmounts.sort(({ amount: a1 }, { amount: a2 }) => {
            return a2 - a1
        })

        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        const dataset = [{
            type: 'amount'
        }] as BarChartProps['dataset']

        const maxAmountTxtLength = Math.max(...accountAmounts.map(({ amount }) => valueFormatter(amount).length))

        accountAmounts.forEach(({ account, amount }) => {
            dataset![0][account.id] = amount
        })

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
            series: accountAmounts.map(({ account }) => {
                return {
                    dataKey: account.id,
                    label: account.name,
                    valueFormatter
                }
            }) as BarChartProps['series'],
            margin: {
                //30 for y axis space
                left: maxAmountTxtLength * 8 /* + 30 */,
                right: 4,
                top: 8,
                // bottom: 4,
            },
            sx: {
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                    //25 for y axis space
                    transform: `translate(-${maxAmountTxtLength * 8/* - 25*/}px, 0)`,
                }
            } as SxProps<Theme>,
            slotProps: {
                legend: {
                    hidden: true
                },
                axisContent: {
                    sx: {
                        ['.MuiChartsTooltip-valueCell']: {
                            textAlign: 'right'
                        }
                    }
                },
                noDataOverlay: { message: ll('noData') },
            } as BarChartProps['slotProps']
        }
    }, [accountType, bookAccounts, fixBalanceFractionDigits, hideEmptyBalance, i18n, ll, report])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vlayout, appStyles.barChart, {
                minHeight: 300
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
                {report?.book && <Typography variant="caption">{report?.book.name}</Typography>}
                {accountType && <Typography variant="caption" color={colorScheme[accountType]}>{ll(`account.type.${accountType}`)}</Typography>}
                {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
            </Stack>
            {chartProps ? <BarChart skipAnimation
                colors={colorScheme.chartColorPalette}
                dataset={chartProps.dataset}
                xAxis={chartProps.xAxis}
                series={chartProps.series}
                margin={chartProps.margin}
                sx={chartProps.sx}
                slotProps={chartProps.slotProps}
                height={styles.height}
            ><ChartsReferenceLine
                    y={0}
                    lineStyle={{ strokeDasharray: '10 5' }}
                    labelAlign="start"
                />
            </BarChart> :
                <Stack direction={'column'} flex={1} justifyContent={'center'}>
                    <CircularProgress />
                </Stack>}
        </CardContent>
    </Card>
})

export default AccountTypeBalanceBarChartCard