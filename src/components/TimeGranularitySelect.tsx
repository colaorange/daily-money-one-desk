import { useI18nLabel } from "@/contexts/useI18n";
import { TimeGranularity } from "@/types";
import { FormControl, InputLabel, MenuItem, Select, SxProps, Theme } from "@mui/material";
import { memo } from "react";


export type TimeGranularitySelectProps = {
    mode?: TimeGranularity
    modes?: TimeGranularity[]
    onChange?: (mode?: TimeGranularity) => void
    sx?: SxProps<Theme>
    label?: string
}

export const TimeGranularityModeSelect = memo(function TimeGranularityModeSelect({ mode, label, modes = Object.values(TimeGranularity), onChange, sx = { minWidth: { sm: 100 } } }: TimeGranularitySelectProps) {
    const ll = useI18nLabel()
    const timeGranularityLabel = label || ll('desktop.timeGranularity')
    return <FormControl>
        <InputLabel>{timeGranularityLabel}</InputLabel>
        <Select
            value={mode}
            sx={sx}
            label={timeGranularityLabel}
            onChange={onChange ? (evt) => {
                const mode = evt.target.value
                onChange(modes?.find((m) => m === mode))
            } : undefined}
        >
            {modes?.map((b) => {
                return <MenuItem value={b}>{ll(`desktop.timeGranularity.${b}`)}</MenuItem>
            })}
        </Select>
    </FormControl>
})


export default TimeGranularityModeSelect