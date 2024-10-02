
import useTheme from "@/contexts/useTheme";
import utilStyles from "@/utilStyles";
import Toolbar from '@mui/material/Toolbar';
import { memo, PropsWithChildren } from "react";

export type AppToolbarProps = PropsWithChildren<{ sxGap?: number, align?: 'start' | 'end' }>

export const AppToolbar = memo(function AppToolbar({ children, sxGap, align }: AppToolbarProps) {

    const { appScheme } = useTheme()

    return <Toolbar css={utilStyles.alignSelfStretch} sx={{ bgcolor: appScheme.toolbarBgColor, gap: sxGap, justifyContent: align === 'end' ? 'flex-end' : 'flex-start' }}>
        {children}
    </Toolbar>

})

export default AppToolbar