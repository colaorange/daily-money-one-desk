import useTheme from "@/contexts/useTheme";

import { Badge, Box, IconButton } from "@mui/material";

import { memo, useCallback, useState } from "react";
import { FaCalendarDays } from "react-icons/fa6";
import AccountsPopover from "./AccountsPopover";
import { Account } from "@client/model";
import { FaBookmark } from "react-icons/fa";

export type AccountsPopoverButtonProps = {
    accounts: Account[]
    selectedAccountIds: Set<string>
    onSelectedAccountsChange?: (selectedAccountIds: Set<string>) => void
    disabled?: boolean
}

export const AccountsPopoverButton = memo(function AccountsPopoverButton({ accounts, selectedAccountIds, onSelectedAccountsChange, disabled }: AccountsPopoverButtonProps) {
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
                <FaBookmark />
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