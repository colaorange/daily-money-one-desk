

import { accountTypeFactor } from "@/appUtils";
import { FullLoading } from "@/components/FullLoading";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { Account, AccountType, Book, BookBalanceReport } from "@client/model";
import { Card, CardContent, css, Stack, Typography } from "@mui/material";
import { PieChartProps } from "@mui/x-charts";
import { PieChart } from '@mui/x-charts/PieChart';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountsBalancePieChartCardProps = PropsWithChildren<{
    book: Book
    accountType: AccountType
    bookAccounts: Account[]

    timePeriod?: TimePeriod
    report?: BookBalanceReport
    refreshing?: boolean
}>

export const AccountsBalancePieChartCard = observer(function AccountTypeBalanceCard({ book, report, accountType, timePeriod, bookAccounts, refreshing }: AccountsBalancePieChartCardProps) {


    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { label: ll } = i18n
    const { fixBalanceFractionDigits } = usePreferences() || {}

    const chartProps = useMemo(() => {
        if (!book || !report) {
            return undefined
        }
        const { accounts: reportAccounts } = report
        const { language } = i18n

        const accountMap = new Map(bookAccounts.map(a => [a.id, a]))

        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })

        const accountAmounts = Object.keys(reportAccounts).filter((aid) => {
            const account = accountMap.get(aid)
            return account?.type === accountType
        }).map((aid) => {
            const account = accountMap.get(aid)
            const balance = reportAccounts[aid]
            const amount = (balance.depositsAmount - balance.withdrawalsAmount) * accountTypeFactor(accountType)
            return { account: account!, amount }
        }).filter((a) => a.amount > 0).sort(({ amount: a1 }, { amount: a2 }) => {
            return a2 - a1
        })

        if (accountAmounts.length === 0) {
            return null
        }

        function valueFormatter(value: number | null) {
            return `${value !== null ? numberFormat.format(value) : ''}`;
        }
        return {
            series: [{
                data: accountAmounts.map(({ account, amount }) => {
                    return {
                        id: account.id,
                        label: account.name,
                        value: amount,
                        valueFormatter
                    }
                }),
                startAngle: 0,
                endAngle: 360,
                innerRadius: 30,
                outerRadius: 120,
                paddingAngle: 3,
                cornerRadius: 5,
                cx: '30%',
                arcLabel: (item) => valueFormatter(item.value),
                arcLabelMinAngle: 20,
                arcLabelRadius: '60%',
            }] as PieChartProps['series'],
            slotProps: {
                legend: {
                    position: { vertical: 'middle', horizontal: 'right' },
                    itemMarkHeight: 14,
                    itemMarkWidth: 14,
                    labelStyle: {
                        fontSize: 16
                    }
                },
                noDataOverlay: { message: ll('noData') },
            } as PieChartProps['slotProps']
        }
    }, [accountType, book, bookAccounts, fixBalanceFractionDigits, i18n, ll, report])

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
                {accountType && <Typography variant="caption" color={colorScheme[accountType]}>{ll(`account.type.${accountType}`)}</Typography>}
                {timePeriod && <TimePeriodInfo timePeriod={timePeriod} hideGranularity />}
            </Stack>
            <Stack css={styles.content}>
                {chartProps === undefined && <FullLoading />}
                {chartProps === null && <Typography css={utilStyles.vclayout} flex={1}>{ll('noData')}</Typography>}
                {chartProps && <PieChart skipAnimation
                    colors={colorScheme.chartColorPalette}
                    series={chartProps.series}
                    slotProps={chartProps.slotProps}
                    height={styles.height}
                >
                </PieChart>}
                {refreshing && <FullLoading css={utilStyles.absoluteCenter} delay={400} />}
            </Stack>
        </CardContent>
    </Card>
})

export default AccountsBalancePieChartCard