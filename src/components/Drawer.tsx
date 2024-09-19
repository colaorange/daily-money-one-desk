import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

const drawerWidth = 260;

export const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default Drawer

export const DrawerMobile = styled(MuiDrawer)({
    minWidth: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    [`& .${drawerClasses.paper}`]: {
        minWidth: drawerWidth,
        boxSizing: 'border-box',
    },
});

export {
    // eslint-disable-next-line react-refresh/only-export-components
    drawerClasses
}

