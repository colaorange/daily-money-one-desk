

import { accountTypeFactor, toCurrencySymbol } from "@/appUtils";
import TimePeriodInfo from "@/components/TimePeriodInfo";
import { usePreferences } from "@/contexts/useApi";
import useI18n from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimePeriod } from "@/types";
import { getNumberFormat } from "@/utils";
import utilStyles from "@/utilStyles";
import { AccountType, BookBalanceReport } from "@client/model";
import { Card, CardContent, CircularProgress, css, Stack, Typography } from "@mui/material";
import { PieChartProps } from "@mui/x-charts";
import { PieChart } from '@mui/x-charts/PieChart';
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useMemo } from "react";

export type AccountTypeBalancePieChartCardProps = PropsWithChildren<{
    timePeriod?: TimePeriod
    report?: BookBalanceReport
    accountType: AccountType
}>

export const AccountTypeBalancePieChartCard = observer(function AccountTypeBalanceCard({ report, accountType, timePeriod }: AccountTypeBalancePieChartCardProps) {


    const { colorScheme, appStyles, theme } = useTheme()
    const i18n = useI18n()
    const { label: ll } = i18n
    const { fixBalanceFractionDigits } = usePreferences() || {}

    const chartProps = useMemo(() => {
        if (!report) {
            return undefined
        }
        const { book, accounts: reportAccounts } = report
        const { language } = i18n


        const fractionDigits = book.fractionDigits || 0
        const numberFormat = getNumberFormat(language, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fixBalanceFractionDigits ? fractionDigits : undefined })

        const accountAmounts = Object.values(reportAccounts).filter((a) => a.account.type === accountType).map((accountBalance) => {
            const amount = (accountBalance.depositsAmount - accountBalance.withdrawalsAmount) * accountTypeFactor(accountType)
            return { account: accountBalance.account, amount }
        }).filter((a) => a.amount > 0).sort(({ amount: a1 }, { amount: a2 }) => {
            return a2 - a1
        })

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
    }, [accountType, fixBalanceFractionDigits, i18n, ll, report])

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
            {chartProps ? <PieChart skipAnimation
                colors={colorScheme.chartColorPalette}
                series={chartProps.series}
                slotProps={chartProps.slotProps}
                height={styles.height}
            >
            </PieChart> :
                <Stack direction={'column'} flex={1} justifyContent={'center'}>
                    <CircularProgress />
                </Stack>}
        </CardContent>
    </Card>
})

export default AccountTypeBalancePieChartCard