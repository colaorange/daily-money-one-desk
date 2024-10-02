import { DEFAULT_DATE_FORMAT, DEFAULT_MONTH_FORMAT } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import { useI18nLabel } from "@/contexts/useI18n";
import { TimeGranularity, TimePeriod } from "@/types";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { css } from '@mui/material/styles';
import moment from "moment";
import { memo, useMemo } from "react";


export type TimePeriodButtonProps = {
    timePeriod: TimePeriod
    hideGranularity?: boolean
}

export const TimePeriodInfo = memo(function TimePeriodInfo({ timePeriod, hideGranularity }: TimePeriodButtonProps) {

    const { start, end, granularity } = timePeriod
    const ll = useI18nLabel()
    const prefs = usePreferences()
    const { dateFormat = DEFAULT_DATE_FORMAT, monthFormat = DEFAULT_MONTH_FORMAT } = prefs || {}

    const startm = start !== null && moment(Math.min(start, end)).startOf('day')
    const endm = moment(start ? Math.max(start, end) : end).endOf('day')

    const styles = useMemo(() => {
        return {
            text: css({
                fontSize: !hideGranularity ? '0.7rem' : undefined,
                fontWeight: !hideGranularity ? 100 : undefined,
                lineHeight: !hideGranularity ? 1.4 : undefined
            })
        }
    }, [hideGranularity])

    const startLabel = useMemo(() => {
        if (!startm) {
            return ll('desktop.initDay')
        }
        switch (granularity) {
            case TimeGranularity.DAILY:
                return startm.format(dateFormat)
            case TimeGranularity.MONTHLY:
                return startm.format(monthFormat)
            case TimeGranularity.YEARLY:
                return startm.format('YYYY')
        }
    }, [dateFormat, granularity, ll, monthFormat, startm])

    const endLabel = useMemo(() => {
        switch (granularity) {
            case TimeGranularity.DAILY:
                return endm.format(dateFormat)
            case TimeGranularity.MONTHLY:
                return endm.format(monthFormat)
            case TimeGranularity.YEARLY:
                return endm.format('YYYY')
        }
    }, [dateFormat, endm, granularity, monthFormat])

    return <Stack direction='column' alignItems={'center'} >
        <Stack direction='row' sx={{ gap: 1 }}>
            <Typography variant="caption" css={styles.text} >{startLabel}</Typography>
            <Typography variant="caption" css={styles.text} >-</Typography>
            <Typography variant="caption" css={styles.text} >{endLabel}</Typography>
        </Stack>
        {!hideGranularity && <Typography variant="caption" css={styles.text} >{ll('timeGranularity')} : {ll(`timeGranularity.${granularity}`)}</Typography>}
    </Stack>
})


export default TimePeriodInfo