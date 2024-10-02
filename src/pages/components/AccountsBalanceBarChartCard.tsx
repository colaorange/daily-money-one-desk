

import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import { FullLoading } from '@/components/FullLoading';
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { Account, AccountType, Book, BookBalanceReport } from "@client/model";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { css, SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChartProps, ChartsReferenceLine, chartsTooltipClasses, ChartsXAxisProps } from "@mui/x-charts";
import { BarChart } from '@mui/x-charts/BarChart';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountsBalanceBarChartCardProps = PropsWithChildren<{
    book: Book
    accountType: AccountType
    bookAccounts: Account[]

    timePeriod?: TimePeriod
    report?: BookBalanceReport
    refreshing?: boolean
}>

export const AccountsBalanceBarChartCard = observer(function AccountTypeBalanceCard({ book, report, accountType, timePeriod, bookAccounts, refreshing }: AccountsBalanceBarChartCardProps) {

    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { language, label: ll } = i18n
    const { fixBalanceFractionDigits, hideEmptyBalance } = usePreferences() || {}

    const chartProps = useMemo(() => {
        if (!book || !report) {
            return undefined
        }
        const { accounts: reportAccounts } = report


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

        if (accountAmounts.length === 0) {
            return null
        }

        accountAmounts.sort(({ amount: a1 }, { amount: a2 }) => {
            return a2 - a1
        })

        const currencySymbol = book.symbol || toCurrencySymbol(i18n, book.currency || '')

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }

        const dataset = (accountAmounts.length > 0 ? [{
            type: 'amount'
        }] : []) as BarChartProps['dataset']

        const maxAmountTxtLength = Math.max(...accountAmounts.map(({ amount }) => valueFormatter(amount).length))

        accountAmounts.forEach(({ account, amount }) => {
            dataset![0][account.id] = amount
        })

        return {
            dataset,
            xAxis: (accountAmounts.length > 0 ? [
                {
                    scaleType: 'band',
                    dataKey: 'type',
                    valueFormatter: (value: number, ctx: any) => {
                        return ctx.location === 'tooltip' ? `${ll('balance.amount')}${currencySymbol ? ` (${currencySymbol})` : ''}` : ''
                    },
                } as ChartsXAxisProps,
            ] : []) as BarChartProps['xAxis'],
            series: accountAmounts.map(({ account }) => {
                return {
                    dataKey: account.id,
                    label: account.name,
                    valueFormatter
                }
            }) as BarChartProps['series'],
            margin: {
                //30 for y axis space
                left: (maxAmountTxtLength + 1) * 8 /* + 30 */,
                right: 4,
                top: 8,
                // bottom: 4,
            },
            sx: {
                //y axis label
                // [`.${axisClasses.left} .${axisClasses.label}`]: {
                //     //25 for y axis space
                //     transform: `translate(-${(maxAmountTxtLength + 1) * 8/* - 25*/}px, 0)`,
                // }
            } as SxProps<Theme>,
            slotProps: {
                legend: {
                    hidden: true
                },
                axisContent: {
                    sx: {
                        [`.${chartsTooltipClasses.valueCell}`]: {
                            textAlign: 'right'
                        }
                    }
                }
            } as BarChartProps['slotProps'],
        }
    }, [accountType, bookAccounts, fixBalanceFractionDigits, hideEmptyBalance, i18n, language, ll, book, report])

    const styles = useMemo(() => {
        return {
            content: css(utilStyles.vlayout, appStyles.barChart, {
                minHeight: 300,
                position: 'relative',
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
                {accountType && <Typography variant="caption" color={colorScheme[accountType]}>{ll(`account.type.${accountType}`)}</Typography>}
                {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
            </Stack>
            <Stack css={styles.content}>
                {chartProps === undefined && <FullLoading />}
                {chartProps === null && <Typography css={utilStyles.vclayout} flex={1}>{ll('noData')}</Typography>}
                {chartProps && <BarChart skipAnimation
                    colors={colorScheme.chartColorPalette}
                    dataset={chartProps.dataset}
                    xAxis={chartProps.xAxis}
                    series={chartProps.series}
                    margin={chartProps.margin}
                    sx={chartProps.sx}
                    slotProps={chartProps.slotProps}
                    height={styles.height}
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

export default AccountsBalanceBarChartCard