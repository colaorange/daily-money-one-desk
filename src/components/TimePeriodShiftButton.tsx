import { TimePeriod } from "@/types";
import { IconButton } from "@mui/material";

import moment from "moment";
import { memo, PropsWithChildren, useCallback } from "react";
import { FaAngleLeft, FaAngleRight, FaStop } from "react-icons/fa6";

export type TimePeriodButtonProps = PropsWithChildren<{
    timePeriod: TimePeriod
    onShift?: (timePeriod: TimePeriod) => void
    varient: 'previousYear' | 'previousMonth' | 'previousWeek' | 'previousDay' | 'today' | 'nextDay' | 'nextWeek' | 'nextMonth' | 'nextYear'
}>


export const TimePeriodShiftButton = memo(function TimePeriodPopover({ timePeriod, varient, onShift: onOuterShift, children }: TimePeriodButtonProps) {

    const onShift = useCallback((timePeriod: TimePeriod, value: number, unit: 'year' | 'month' | 'week' | 'day') => {
        if (onOuterShift) {
            const { start, end, granularity } = timePeriod
            onOuterShift!({
                start: start !== null ? moment(start).add(value, unit).valueOf() : null,
                end: moment(end).add(value, unit).valueOf(),
                granularity
            })
        }
    }, [onOuterShift])

    const onToday = useCallback((timePeriod: TimePeriod) => {
        if (onOuterShift) {
            let { start } = timePeriod
            const { end, granularity } = timePeriod
            const today = moment().endOf('day')
            if (start) {
                start = moment(start).add(today.diff(moment(end), 'day'), 'day').valueOf()
            }
            onOuterShift!({
                start,
                end: today.valueOf(),
                granularity
            })
        }
    }, [onOuterShift])


    const onClick = useCallback(() => {
        if (onOuterShift) {
            switch (varient) {
                case "previousYear":
                    onShift(timePeriod, -1, 'year')
                    break;
                case "previousMonth":
                    onShift(timePeriod, -1, 'month')
                    break;
                case "previousWeek":
                    onShift(timePeriod, -1, 'week')
                    break;
                case "previousDay":
                    onShift(timePeriod, -1, 'day')
                    break;
                case "today":
                    onToday(timePeriod)
                    break;
                case "nextDay":
                    onShift(timePeriod, 1, 'day')
                    break;
                case "nextWeek":
                    onShift(timePeriod, 1, 'week')
                    break;
                case "nextMonth":
                    onShift(timePeriod, 1, 'month')
                    break;
                case "nextYear":
                    onShift(timePeriod, 1, 'year')
                    break;
            }
        }
    }, [onOuterShift, varient, onShift, timePeriod, onToday])

    return <IconButton size="small" onClick={onClick}>
        {children && children}
        {!children && (varient === 'previousYear' || varient === 'previousMonth' || varient === 'previousWeek' || varient === 'previousDay') && <FaAngleLeft />}
        {!children && varient === 'today' && <FaStop />}
        {!children && (varient === 'nextYear' || varient === 'nextMonth' || varient === 'nextWeek' || varient === 'nextDay') && <FaAngleRight />}
    </IconButton>
})


export default TimePeriodShiftButton