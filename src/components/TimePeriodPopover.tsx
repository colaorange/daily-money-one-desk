import { useI18nLabel } from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimeGranularity, TimePeriod } from "@/types";
import { Button, css, Divider, FormControlLabel, IconButton, Popover, PopoverProps, Stack, Switch } from "@mui/material";

import { DEFAULT_DATE_FORMAT } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import { memo, useCallback, useMemo, useState } from "react";
import { FaFastBackward, FaFastForward, FaStepBackward, FaStepForward } from "react-icons/fa";
import TimeGranularitySelect from "./TimeGranularitySelect";
import { FaStop } from "react-icons/fa6";

export type TimePeriodPopoverProps = {
    timePeriod: TimePeriod
    granularityModes?: TimeGranularity[]
    onTimePeriodClose?: (timePeriod: TimePeriod) => void
} & PopoverProps


function normalize2Moment(start: number | null, end: number) {
    const mstart = start !== null ? moment(Math.min(start, end)).startOf('day') : null
    const mend = (start !== null ? moment(Math.max(start, end)) : moment(end)).endOf('day')
    return {
        mstart, mend
    }
}

export const TimePeriodPopover = memo(function TimePeriodPopover({ timePeriod, granularityModes = Object.values(TimeGranularity), onTimePeriodClose, ...rest }: TimePeriodPopoverProps) {
    const { theme, appScheme } = useTheme()
    const { dateFormat = DEFAULT_DATE_FORMAT } = usePreferences() || {}
    const ll = useI18nLabel()
    const [startFromInit, setStartFromInit] = useState(timePeriod.start === null)

    const { mstart, mend } = normalize2Moment(timePeriod.start, timePeriod.end)

    const [start, setStart] = useState<moment.Moment | null>(mstart)
    const [end, setEnd] = useState(mend)
    const [granularity, setGranularity] = useState(timePeriod.granularity)

    const onClose = useCallback(() => {
        if (onTimePeriodClose) {
            const tp = {
                start: (!startFromInit && start !== null) ? Math.min(start.valueOf(), end.valueOf()) : null,
                end: (!startFromInit && start !== null) ? Math.max(start.valueOf(), end.valueOf()) : end.valueOf(),
                granularity
            }
            onTimePeriodClose(tp)

            const { mstart, mend } = normalize2Moment(tp.start, tp.end)

            setStart(mstart)
            setEnd(mend)
        }
    }, [end, startFromInit, granularity, start, onTimePeriodClose])

    const onChangeGranularity = useCallback((granularity?: TimeGranularity) => {
        if (granularity) {
            setGranularity(granularity)
        }
    }, [])


    const styles = useMemo(() => {
        return {
            popover: css({
                gap: theme.spacing(2),
                padding: theme.spacing(2),
            }),
            bar: css({
                flexFlow: 'wrap',
                justifyContent: 'start'
            }),
            playbar: css({
                flexFlow: 'wrap',
                justifyContent: 'space-around'
            }),
            button: css({
                fontSize: '0.7rem',
                fontWeight: 100,
            }),
            divider: css({
                borderColor: appScheme.outlineColor
            })
        }
    }, [theme, appScheme])

    const onThisMonth = useCallback(() => {
        setStart(moment().startOf('month'))
        setEnd(moment().endOf('month'))
        setGranularity(TimeGranularity.DAILY)
        setStartFromInit(false)
    }, [])

    const onLastMonth = useCallback(() => {
        setStart(moment().add(-1, 'month').startOf('month'))
        setEnd(moment().add(-1, 'month').endOf('month'))
        setGranularity(TimeGranularity.DAILY)
        setStartFromInit(false)
    }, [])

    const onInAMonth = useCallback(() => {
        setStart(moment().add(-1, 'month').add(1, 'day').startOf('day'))
        setEnd(moment().endOf('day'))
        setGranularity(TimeGranularity.DAILY)
        setStartFromInit(false)
    }, [])

    const onInSixMonths = useCallback(() => {
        setStart(moment().add(-6, 'month').add(1, 'day').startOf('day'))
        setEnd(moment().endOf('day'))
        setGranularity(TimeGranularity.DAILY)
        setStartFromInit(false)
    }, [])

    const onThisYear = useCallback(() => {
        setStart(moment().startOf('year'))
        setEnd(moment().endOf('year'))
        setGranularity(TimeGranularity.MONTHLY)
        setStartFromInit(false)
    }, [])

    const onLastYear = useCallback(() => {
        setStart(moment().add(-1, 'year').startOf('year'))
        setEnd(moment().add(-1, 'year').endOf('year'))
        setGranularity(TimeGranularity.MONTHLY)
        setStartFromInit(false)
    }, [])

    const onInAYear = useCallback(() => {
        setStart(moment().add(-1, 'year').add(1, 'day').startOf('day'))
        setEnd(moment().endOf('day'))
        setGranularity(TimeGranularity.MONTHLY)
        setStartFromInit(false)
    }, [])

    const onInThreeYears = useCallback(() => {
        setStart(moment().add(-3, 'year').add(1, 'day').startOf('day'))
        setEnd(moment().endOf('day'))
        setGranularity(TimeGranularity.MONTHLY)
        setStartFromInit(false)
    }, [])

    const onInSixYears = useCallback(() => {
        setStart(moment().add(-6, 'year').add(1, 'day').startOf('day'))
        setEnd(moment().endOf('day'))
        setGranularity(TimeGranularity.MONTHLY)
        setStartFromInit(false)
    }, [])

    const onChangeStart = useCallback((m: moment.Moment | null) => {
        setStart((s) => m?.isValid() ? m : s)
    }, [])
    const onChangeEnd = useCallback((m: moment.Moment | null) => {
        setEnd((e) => m?.isValid() ? m : e)
    }, [])

    const onToggleStartFromInit = useCallback(() => {
        if (!start && !startFromInit) {
            setStart(end.clone().add(-1, 'month').add(-1, 'day').startOf('day'))
        }
        setStartFromInit(!startFromInit)
    }, [startFromInit, start, end])

    const onPreviousMonth = useCallback(() => {
        if (start) {
            setStart(start.clone().add(-1, 'month').startOf('day'))
        }
        setEnd(end.clone().add(-1, 'month').endOf('day'))
    }, [start, end])

    const onNextMonth = useCallback(() => {
        if (start) {
            setStart(start.clone().add(1, 'month').startOf('day'))
        }
        setEnd(end.clone().add(1, 'month').endOf('day'))
    }, [start, end])
    const onPreviousYear = useCallback(() => {
        if (start) {
            setStart(start.clone().add(-1, 'year').startOf('day'))
        }
        setEnd(end.clone().add(-1, 'year').endOf('day'))
    }, [start, end])

    const onNextYear = useCallback(() => {
        if (start) {
            setStart(start.clone().add(1, 'year').startOf('day'))
        }
        setEnd(end.clone().add(1, 'year').endOf('day'))
    }, [start, end])

    const onToday = useCallback(() => {
        const today = moment().endOf('day')
        if (start) {
            const endDayDiff = today.diff(end, 'day')
            setStart(start.clone().add(endDayDiff, 'day').startOf('day'))
        }
        setEnd(today)
    }, [start, end])

    return <Popover
        onClose={onClose}
        {...rest}
    >
        <Stack direction='column' css={styles.popover} sx={{
            maxWidth: {
                md: '400px',
                xs: '60vw',
            }
        }}>
            <Stack direction='row' css={styles.bar} >
                <Button css={styles.button} onClick={onThisMonth}>{ll('desktop.thisMonth')}</Button>
                <Button css={styles.button} onClick={onLastMonth}>{ll('desktop.lastMonth')}</Button>
                <Button css={styles.button} onClick={onInAMonth}>{ll('desktop.inAMonth')}</Button>
                <Button css={styles.button} onClick={onInSixMonths}>{ll('desktop.inSixMonths')}</Button>
            </Stack>
            <Stack direction='row' css={styles.bar} >
                <Button css={styles.button} onClick={onThisYear}>{ll('desktop.thisYear')}</Button>
                <Button css={styles.button} onClick={onLastYear}>{ll('desktop.lastYear')}</Button>
                <Button css={styles.button} onClick={onInAYear}>{ll('desktop.inAYear')}</Button>
                <Button css={styles.button} onClick={onInThreeYears}>{ll('desktop.inThreeYears')}</Button>
                <Button css={styles.button} onClick={onInSixYears}>{ll('desktop.inSixYears')}</Button>
            </Stack>
            <Divider flexItem css={styles.divider} />
            <FormControlLabel labelPlacement="start" control={<Switch checked={startFromInit} />} label={ll('desktop.startFromInitDay')} onChange={onToggleStartFromInit} />
            {!startFromInit && <DatePicker label={ll('desktop.startDate')} format={dateFormat} value={start} onChange={onChangeStart} />}
            <DatePicker label={ll('desktop.endDate')} format={dateFormat} value={end} onChange={(onChangeEnd)} />
            <Stack direction='row' css={styles.playbar} >
                <IconButton size="small" onClick={onPreviousYear}>
                    <FaFastBackward />
                </IconButton>
                <IconButton size="small" onClick={onPreviousMonth}>
                    <FaStepBackward />
                </IconButton>
                <IconButton size="small" onClick={onToday}>
                    <FaStop />
                </IconButton>
                <IconButton size="small" onClick={onNextMonth}>
                    <FaStepForward />
                </IconButton>
                <IconButton size="small" onClick={onNextYear}>
                    <FaFastForward />
                </IconButton>
            </Stack>
            <TimeGranularitySelect value={granularity} onChange={onChangeGranularity} candidates={granularityModes} />
        </Stack>

    </Popover>
})


export default TimePeriodPopover