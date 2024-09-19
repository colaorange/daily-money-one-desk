import { drawerClasses, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from './Drawer';
import MenuContent from './MenuContent';
import MenuLogout from './MenuLogout';
import MenuUserInfo from './MenuUserInfo';

export default function SideMenu() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                    overflow: 'hidden'
                },
            }}
        >
            <MenuUserInfo />
            <Divider />
            <Stack
                sx={{
                    flex:1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <MenuContent />
            </Stack>
            <Divider />
            <MenuLogout />
        </Drawer>
    );
}