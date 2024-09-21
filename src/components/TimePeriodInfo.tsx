import { DEFAULT_DATE_FORMAT } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import { useI18nLabel } from "@/contexts/useI18n";
import { TimePeriod } from "@/types";
import { css, Stack, Typography } from "@mui/material";
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
    const { dateFormat = DEFAULT_DATE_FORMAT } = prefs || {}

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

    return <Stack direction='column' alignItems={'center'} >
        <Stack direction='row' sx={{ gap: 1 }}>
            <Typography variant="caption" css={styles.text} >{startm ? startm.format(dateFormat) : ll('desktop.initDay')}</Typography>
            <Typography variant="caption" css={styles.text} >-</Typography>
            <Typography variant="caption" css={styles.text} >{endm.format(dateFormat)}</Typography>
        </Stack>
        {!hideGranularity && <Typography variant="caption" css={styles.text} >{ll('desktop.timeGranularity')} : {ll(`desktop.timeGranularity.${granularity}`)}</Typography>}
    </Stack>
})


export default TimePeriodInfo