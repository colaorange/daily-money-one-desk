import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import SideMenuMobile from './SideMenuMobile';
import { useI18nLabel } from '@/contexts/useI18n';
import useTheme from '@/contexts/useTheme';


export default function AppNavbar() {
    const ll = useI18nLabel()
    const {theme, appColorScheme } = useTheme()

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                display: { xs: 'auto', md: 'none' },
                boxShadow: 0,
                bgcolor: appColorScheme.navbarBgColor,
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 0,
            }}
        >
            <Toolbar variant="regular" style={{ height: theme.mixins.toolbar.minHeight }}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'start', gap: theme.spacing(1), flex: 1, overflow: 'hidden' }}>
                    <IconButton size="small" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuRoundedIcon />
                    </IconButton>
                    <Typography variant="h5" component="span"
                        sx={{ color: 'text.primary' }}
                        style={{ display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {ll('appName')}
                    </Typography>
                </Stack>
                <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />

            </Toolbar>
        </AppBar>
    );
}
