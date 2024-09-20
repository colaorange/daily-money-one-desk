import { useI18nLabel } from "@/contexts/useI18n";
import { TimeGranularity } from "@/types";
import { FormControl, InputLabel, MenuItem, Select, SxProps, Theme } from "@mui/material";
import { memo } from "react";


export type TimeGranularitySelectProps = {
    value?: TimeGranularity
    candidates?: TimeGranularity[]
    onChange?: (value?: TimeGranularity) => void
    sx?: SxProps<Theme>
    label?: string
}

export const TimeGranularitySelect = memo(function TimeGranularitySelect({ value, label, candidates = Object.values(TimeGranularity), onChange, sx = { minWidth: { sm: 100 } } }: TimeGranularitySelectProps) {
    const ll = useI18nLabel()
    const timeGranularityLabel = label || ll('desktop.timeGranularity')
    return <FormControl>
        <InputLabel>{timeGranularityLabel}</InputLabel>
        <Select
            value={value}
            sx={sx}
            label={timeGranularityLabel}
            onChange={onChange ? (evt) => {
                const mode = evt.target.value
                onChange(candidates?.find((m) => m === mode))
            } : undefined}
        >
            {candidates?.map((b) => {
                return <MenuItem key={b} value={b}>{ll(`desktop.timeGranularity.${b}`)}</MenuItem>
            })}
        </Select>
    </FormControl>
})


export default TimeGranularitySelect