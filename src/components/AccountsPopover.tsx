import { useI18nLabel } from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import { Account } from "@client/model";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Popover, { PopoverProps } from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { css } from '@mui/material/styles';
import { memo, useCallback, useEffect, useMemo, useState } from "react";

export type AccountsPopoverProps = {
    accounts: Account[]
    selectedAccountIds: Set<string>
    onAccountsClose?: (selectedAccountIds: Set<string>) => void
} & PopoverProps

export const AccountsPopover = memo(function TimePeriodPopover({ accounts, selectedAccountIds, onAccountsClose, ...rest }: AccountsPopoverProps) {
    const { theme } = useTheme()
    const ll = useI18nLabel()

    const [stateSelectedAccountIds, setStateSelectedAccountIds] = useState<Set<string>>(selectedAccountIds)

    const toggleSelectedAccountId = useCallback((accountId: string) => {
        setStateSelectedAccountIds((s) => {
            const newSet = new Set(s)
            if (!newSet.delete(accountId)) {
                newSet.add(accountId)
            }
            return newSet
        })
    }, [])

    //reset state by props
    useEffect(() => {
        setStateSelectedAccountIds(selectedAccountIds)
    }, [selectedAccountIds])

    const resetOrClose = useCallback((selectedAccountIds: Set<string>) => {
        if (onAccountsClose) {
            onAccountsClose(selectedAccountIds)
        } else {
            setStateSelectedAccountIds(selectedAccountIds)
        }
    }, [onAccountsClose])


    const onClose = useCallback(() => {
        resetOrClose(stateSelectedAccountIds)
    }, [resetOrClose, stateSelectedAccountIds])
    const onClear = useCallback(() => {
        setStateSelectedAccountIds(new Set())
    }, [])

    const styles = useMemo(() => {
        return {
            popover: css({
            }),
            listbox: css({
                overflowY: 'auto',
                padding: theme.spacing(1, 2, 0, 2),
            }),
            button: css({
                fontSize: '0.7rem',
                fontWeight: 100,
            }),
            bar: css({
                padding: theme.spacing(1)
            })
        }
    }, [theme])

    return <Popover
        onClose={onClose}
        slotProps={{ paper: { style: { display: 'flex', padding: 0 } } }}
        {...rest}
    >
        <Stack direction='column' css={styles.popover} sx={{
            flex: 1,
            width: {
                md: '400px',
                xs: '60vw',
            },
        }}>
            <Stack direction='column' css={styles.listbox}>
                {accounts.map((a) => {
                    return <FormControlLabel key={a.id}
                        control={<Checkbox size="small" checked={stateSelectedAccountIds.has(a.id)} onChange={() => { toggleSelectedAccountId(a.id) }} />}
                        label={a.name}
                        slotProps={{ typography: { variant: 'caption', style: { textDecoration: a.hidden ? 'line-through' : undefined } } }}
                    />
                })}
            </Stack>
            <Divider flexItem />
            <Stack alignSelf={'flex-end'} direction={'row'} css={styles.bar}>
                <Button css={styles.button} onClick={onClear}>{ll('action.clear')}</Button>
                <Button css={styles.button} onClick={onClose}>{ll('action.close')}</Button>
            </Stack>
        </Stack>
    </Popover>
})


export default AccountsPopover