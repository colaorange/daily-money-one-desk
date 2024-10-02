import { useI18nLabel } from "@/contexts/useI18n";
import { Book } from "@client/model";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { memo } from "react";


export type BookSelectProps = {
    bookId?: string
    books?: Book[]
    onBookChange?: (book?: Book) => void
} & SelectProps

export const BookSelect = memo(function BookSelect({ bookId, books, onBookChange, sx = { minWidth: { sm: 160 } }, ...restProps }: BookSelectProps) {
    const ll = useI18nLabel()
    const bookLabel = ll('book')
    const inBooks = books?.some((b) => b.id === bookId)
    return <FormControl>
        <InputLabel>{bookLabel}</InputLabel>
        <Select
            value={inBooks ? bookId : ''}
            sx={sx}
            label={bookLabel}
            onChange={onBookChange ? (evt) => {
                const bookId = evt.target.value
                onBookChange(books?.find((b) => b.id === bookId))
            } : undefined}
            {...restProps}
        >
            {books?.map((b) => {
                return <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            })}
        </Select>
    </FormControl>
})


export default BookSelect