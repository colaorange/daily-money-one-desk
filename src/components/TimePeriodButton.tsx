import { useI18nLabel } from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimeGranularity, TimePeriod } from "@/types";
import { Box, css, IconButton, SxProps, Theme } from "@mui/material";
import { memo, useMemo } from "react";
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";


export type TimePeriodButtonProps = {
    timePeriod: TimePeriod
    granularityModes?: TimeGranularity[]
    onChange?: (timePeriod?: TimePeriod) => void
}

export const TimePeriodButton = memo(function TimePeriodButton({ timePeriod, granularityModes = Object.values(TimeGranularity), onChange }: TimePeriodButtonProps) {
    const { theme, appStyles } = useTheme()
    const { start, end, granularity } = timePeriod
    const ll = useI18nLabel()
    // const timeGranularityLabel = ll('desktop.timeGranularity')

    return <Box>
        <IconButton size="small" aria-label="menu" css={appStyles.outlineIconButton}>
            {granularity === TimeGranularity.DAILY && <FaCalendarDay />}
            {granularity === TimeGranularity.WEEKLY && <FaCalendarWeek />}
            {granularity === TimeGranularity.MONTHLY && <FaCalendarDays />}
            {granularity === TimeGranularity.YEARLY && <FaCalendar />}
        </IconButton>
    </Box>
})


export default TimePeriodButton