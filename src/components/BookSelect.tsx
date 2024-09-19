import { useI18nLabel } from "@/contexts/useI18n";
import { Book } from "@client/model";
import { FormControl, InputLabel, MenuItem, Select, SelectProps, SxProps, Theme } from "@mui/material";
import { memo } from "react";


export type BookSelectProps = {
    bookId?: string
    books?: Book[]
    onChange?: (book?: Book) => void
    sx?: SxProps<Theme>
}

export const BookSelect = memo(function PrimaryBookSelect({ bookId, books, onChange, sx = { minWidth: 160} }: BookSelectProps) {
    const ll = useI18nLabel()
    const bookLabel = ll('book')
    return <FormControl>
        <InputLabel>{bookLabel}</InputLabel>
        <Select
            value={bookId}
            sx={sx}
            label={bookLabel}
            onChange={onChange ? (evt) => {
                const bookId = evt.target.value
                onChange(books?.find((b) => b.id === bookId))
            } : undefined}
        >
            {books?.map((b) => {
                return <MenuItem value={b.id}>{b.name}</MenuItem>
            })}
        </Select>
    </FormControl>
})


export default BookSelect