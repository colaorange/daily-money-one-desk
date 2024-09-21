import useTheme from "@/contexts/useTheme";
import { TimeGranularity, TimePeriod } from "@/types";
import { Box, IconButton } from "@mui/material";

import { memo, useCallback, useState } from "react";
import { FaCalendarDays } from "react-icons/fa6";
import TimePeriodPopover from "./TimePeriodPopover";

export type TimePeriodPopoverButtonProps = {
    timePeriod: TimePeriod
    granularityModes?: TimeGranularity[]
    onTimePeriodChange?: (timePeriod: TimePeriod) => void
    hideGranularity?: boolean
}

export const TimePeriodPopoverButton = memo(function TimePeriodPopoverButton({ timePeriod, hideGranularity, granularityModes, onTimePeriodChange }: TimePeriodPopoverButtonProps) {
    const { appStyles } = useTheme()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const onClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(evt.currentTarget)
    }, [])

    const onTimePeriodClose = useCallback((timePeriod: TimePeriod) => {
        setAnchorEl(null)
        if (onTimePeriodChange) {
            onTimePeriodChange(timePeriod)
        }
    }, [onTimePeriodChange])

    return <Box>
        <IconButton size="small" aria-label="menu" css={appStyles.outlineIconButton} onClick={onClick}>
            <FaCalendarDays />
        </IconButton>

        {anchorEl && <TimePeriodPopover
            open={true}
            anchorEl={anchorEl}
            
            hideGranularity={hideGranularity}
            onTimePeriodClose={onTimePeriodClose}
            timePeriod={timePeriod}
            granularityModes={granularityModes}

            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
        </TimePeriodPopover>}


    </Box>
})


export default TimePeriodPopoverButton