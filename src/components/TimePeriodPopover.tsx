import { useI18nLabel } from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { TimeGranularity, TimePeriod } from "@/types";
import { Button, css, Divider, FormControlLabel, Popover, PopoverProps, Stack, Switch } from "@mui/material";

import { DEFAULT_DATE_FORMAT } from "@/constants";
import { usePreferences } from "@/contexts/useApi";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaFastBackward, FaFastForward, FaStepBackward, FaStepForward } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight, FaStop } from "react-icons/fa6";
import TimeGranularitySelect from "./TimeGranularitySelect";
import TimePeriodShiftButton from "./TimePeriodShiftButton";

export type TimePeriodPopoverProps = {
    timePeriod: TimePeriod
    hideGranularity?: boolean
    granularityModes?: TimeGranularity[]
    onTimePeriodClose?: (timePeriod: TimePeriod) => void
} & PopoverProps


function normalize2Moment(start: number | null, end: number) {
    const mStart = start !== null ? moment(Math.min(start, end)).startOf('day') : null
    const mEnd = (start !== null ? moment(Math.max(start, end)) : moment(end)).endOf('day')
    return {
        mStart, mEnd
    }
}

type StateMix = {
    fromInit: boolean
    mStart: moment.Moment | null
    mEnd: moment.Moment
    granularity: TimeGranularity
}

export const TimePeriodPopover = memo(function TimePeriodPopover({ timePeriod, hideGranularity, granularityModes = Object.values(TimeGranularity), onTimePeriodClose, ...rest }: TimePeriodPopoverProps) {
    const { theme, appScheme } = useTheme()
    const { dateFormat = DEFAULT_DATE_FORMAT } = usePreferences() || {}
    const ll = useI18nLabel()


    const { mStart, mEnd } = normalize2Moment(timePeriod.start, timePeriod.end)

    //init state

    const [stateMix, setStateMix] = useState<StateMix>({
        fromInit: timePeriod.start === null,
        mStart,
        mEnd,
        granularity: timePeriod.granularity
    })

    const resetState = useCallback((timePeriod: TimePeriod, fromInit?: boolean) => {
        const { mStart, mEnd } = normalize2Moment(timePeriod.start, timePeriod.end)

        setStateMix((s) => {
            return {
                fromInit: fromInit === undefined ? s.fromInit : fromInit,
                mStart,
                mEnd,
                granularity: s.granularity
            }
        })
    }, [])

    //reset state by props timePeriod
    useEffect(() => {
        resetState(timePeriod, timePeriod.start === null)
    }, [resetState, timePeriod])

    const resetOrClose = useCallback((stateMix: StateMix) => {
        const {
            fromInit,
            mStart,
            mEnd,
            granularity,
        } = stateMix
        const closeTimePeriod: TimePeriod = {
            start: (!fromInit && mStart !== null) ? Math.min(mStart.valueOf(), mEnd.valueOf()) : null,
            end: (!fromInit && mStart !== null) ? Math.max(mStart.valueOf(), mEnd.valueOf()) : mEnd.valueOf(),
            granularity
        }

        if (onTimePeriodClose) {
            onTimePeriodClose(closeTimePeriod)
        } else {
            resetState(closeTimePeriod)
        }
    }, [onTimePeriodClose, resetState])

    const onClose = useCallback(() => {
        resetOrClose(stateMix)
    }, [resetOrClose, stateMix])

    const onChangeGranularity = useCallback((granularity?: TimeGranularity) => {
        if (granularity) {
            setStateMix((s) => {
                return {
                    ...s,
                    granularity
                }
            })
        }
    }, [])

    const fixedRange = useCallback((value: number, unit: 'month' | 'year', granularity: TimeGranularity) => {
        resetOrClose({
            fromInit: false,
            mStart: moment().add(value, unit).startOf(unit),
            mEnd: moment().add(value, unit).endOf(unit),
            granularity,
        })
    }, [resetOrClose])


    const onThisMonth = useCallback(() => {
        fixedRange(0, 'month', TimeGranularity.DAILY)
    }, [fixedRange])

    const onLastMonth = useCallback(() => {
        fixedRange(-1, 'month', TimeGranularity.DAILY)
    }, [fixedRange])

    const onThisYear = useCallback(() => {
        fixedRange(0, 'year', TimeGranularity.MONTHLY)
    }, [fixedRange])

    const onLastYear = useCallback(() => {
        fixedRange(-1, 'year', TimeGranularity.DAILY)
    }, [fixedRange])

    const withIn = useCallback((value: number, unit: 'month' | 'year', granularity: TimeGranularity) => {
        resetOrClose({
            fromInit: false,
            mStart: moment().add(value, unit).add(1, 'day').startOf('day'),
            mEnd: moment().endOf('day'),
            granularity,
        })
    }, [resetOrClose])

    const onInAMonth = useCallback(() => {
        withIn(-1, 'month', TimeGranularity.DAILY)
    }, [withIn])

    const onInSixMonths = useCallback(() => {
        withIn(-6, 'month', TimeGranularity.DAILY)
    }, [withIn])

    const onInAYear = useCallback(() => {
        withIn(-1, 'year', TimeGranularity.MONTHLY)
    }, [withIn])

    const onUntilToday = useCallback(() => {
        resetOrClose({
            ...stateMix,
            fromInit: true,
            mStart: null,
            mEnd: moment().endOf('day'),
        })
    }, [stateMix, resetOrClose])

    const onChangeStart = useCallback((m: moment.Moment | null) => {
        setStateMix((s) => {
            return {
                ...s,
                mStart: m?.isValid() ? m : s.mStart
            }
        })
    }, [])
    const onChangeEnd = useCallback((m: moment.Moment | null) => {
        setStateMix((s) => {
            return {
                ...s,
                mEnd: m?.isValid() ? m : s.mEnd
            }
        })
    }, [])

    const onToggleStartFromInit = useCallback(() => {
        setStateMix((s) => {
            const fromInit = !s.fromInit
            return {
                ...s,
                fromInit,
                mStart: (!fromInit && !s.mStart) ? s.mEnd.clone().add(-1, 'month').add(-1, 'day').startOf('day') : s.mStart,
            }
        })
    }, [])

    const onShift = useCallback((timePeriod: TimePeriod) => {
        resetState(timePeriod)
    }, [resetState])


    //don't care fromInit for shift button
    const shfitBtnTimePeriod: TimePeriod = useMemo(() => {
        const {
            mStart,
            mEnd,
            granularity,
        } = stateMix
        return {
            start: (mStart !== null) ? Math.min(mStart.valueOf(), mEnd.valueOf()) : null,
            end: (mStart !== null) ? Math.max(mStart.valueOf(), mEnd.valueOf()) : mEnd.valueOf(),
            granularity
        }
    }, [stateMix])

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
                <Button css={styles.button} onClick={onThisYear}>{ll('desktop.thisYear')}</Button>
                <Button css={styles.button} onClick={onLastYear}>{ll('desktop.lastYear')}</Button>
            </Stack>
            <Stack direction='row' css={styles.bar} >
                <Button css={styles.button} onClick={onInAMonth}>{ll('desktop.inAMonth')}</Button>
                <Button css={styles.button} onClick={onInSixMonths}>{ll('desktop.inSixMonths')}</Button>
                <Button css={styles.button} onClick={onInAYear}>{ll('desktop.inAYear')}</Button>
                <Button css={styles.button} onClick={onUntilToday}>{ll('desktop.untilToday')}</Button>
            </Stack>
            <Divider flexItem css={styles.divider} />
            <FormControlLabel labelPlacement="start" control={<Switch checked={stateMix.fromInit} />} label={ll('desktop.startFromInitDay')} onChange={onToggleStartFromInit} />
            {!stateMix.fromInit && <DatePicker label={ll('desktop.startDate')} format={dateFormat} value={stateMix.mStart} onChange={onChangeStart} />}
            <DatePicker label={ll('desktop.endDate')} format={dateFormat} value={stateMix.mEnd} onChange={(onChangeEnd)} />
            <Stack direction='row' css={styles.playbar} >
                <TimePeriodShiftButton varient="previousYear" timePeriod={shfitBtnTimePeriod} onShift={onShift}>
                    <FaAngleDoubleLeft />
                </TimePeriodShiftButton>
                <TimePeriodShiftButton varient="previousMonth" timePeriod={shfitBtnTimePeriod} onShift={onShift}>
                    <FaAngleLeft />
                </TimePeriodShiftButton>
                <TimePeriodShiftButton varient="today" timePeriod={shfitBtnTimePeriod} onShift={onShift}>
                    <FaStop />
                </TimePeriodShiftButton>
                <TimePeriodShiftButton varient="nextMonth" timePeriod={shfitBtnTimePeriod} onShift={onShift}>
                    <FaAngleRight />
                </TimePeriodShiftButton>
                <TimePeriodShiftButton varient="nextYear" timePeriod={shfitBtnTimePeriod} onShift={onShift}>
                    <FaAngleDoubleRight />
                </TimePeriodShiftButton>
            </Stack>
            {!hideGranularity && <TimeGranularitySelect value={stateMix.granularity} onChange={onChangeGranularity} candidates={granularityModes} />}
            <Divider flexItem css={styles.divider} />
            <Stack alignSelf={'flex-end'} direction={'row'}>
                <Button css={styles.button} onClick={onClose}>{ll('action.close')}</Button>
            </Stack>
        </Stack>
    </Popover>
})


export default TimePeriodPopover