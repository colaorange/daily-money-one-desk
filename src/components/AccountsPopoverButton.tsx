import useTheme from "@/contexts/useTheme";

import { Account } from "@client/model";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { memo, useCallback, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import AccountsPopover from "./AccountsPopover";

export type AccountsPopoverButtonProps = {
    accounts: Account[]
    selectedAccountIds: Set<string>
    onSelectedAccountsChange?: (selectedAccountIds: Set<string>) => void
    disabled?: boolean
    icon?: React.ReactNode
}

export const AccountsPopoverButton = memo(function AccountsPopoverButton({ accounts, selectedAccountIds, onSelectedAccountsChange, disabled, icon }: AccountsPopoverButtonProps) {
    const { appStyles } = useTheme()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const onClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(evt.currentTarget)
    }, [])

    const onAccountsClose = useCallback((selectedAccountIds: Set<string>) => {
        setAnchorEl(null)
        if (onSelectedAccountsChange) {
            onSelectedAccountsChange(selectedAccountIds)
        }
    }, [onSelectedAccountsChange])

    return <Box>
        <Badge badgeContent={selectedAccountIds.size} color="primary" hidden={selectedAccountIds.size <= 0}>
            <IconButton size="small" onClick={onClick} disabled={disabled}>
                {icon || <FaBookmark />}
            </IconButton>
        </Badge>

        {anchorEl && !disabled && <AccountsPopover
            open={true}
            anchorEl={anchorEl}
            onAccountsClose={onAccountsClose}
            accounts={accounts}
            selectedAccountIds={selectedAccountIds}

            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
        </AccountsPopover>}

    </Box>
})


export default AccountsPopoverButton