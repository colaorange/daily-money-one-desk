import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useTheme } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import MenuButton from './MenuButton';
import SideMenuMobile from './SideMenuMobile';


export default function AppNavbar() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme()

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                display: { xs: 'auto', md: 'none' },
                boxShadow: 0,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 0,
            }}
        >
            <Toolbar variant="regular" style={{ minHeight: theme.mixins.toolbar.minHeight }}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'start', gap: theme.spacing(1), flex: 1, overflow: 'hidden' }}>
                    <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuRoundedIcon />
                    </MenuButton>
                    <Typography variant="h5" component="span"
                        sx={{ color: 'text.primary' }}
                        style={{ display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        Daily Money One
                    </Typography>
                </Stack>
                <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />

            </Toolbar>
        </AppBar>
    );
}
