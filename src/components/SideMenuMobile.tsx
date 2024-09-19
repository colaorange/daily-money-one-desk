import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import MenuContent from './MenuContent';
import MenuLogout from './MenuLogout';
import MenuUserInfo from './MenuUserInfo';
import { DrawerMobile } from './Drawer';

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
    return (<DrawerMobile
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
            [`& .${drawerClasses.paper}`]: {
                backgroundImage: 'none',
                backgroundColor: 'background.paper',
                height: '100%'
            },
        }}
    >
        <MenuUserInfo />
        <Divider />
        <Stack
            sx={{
                maxWidth: '70dvw',
                height: '100%',
                overflow: 'auto'
            }}
        >
            <MenuContent />
        </Stack>
        <Divider />
        <MenuLogout />
    </DrawerMobile>);
}