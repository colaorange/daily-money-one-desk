import useApi from '@/contexts/useApi';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default function SideMenu() {

    const { preferences } = useApi()
    const { profile } = preferences || {}

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
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Avatar
                    sizes="small"
                    alt={profile?.name || ''}
                    src={profile?.photo || ''}
                    sx={{ width: 36, height: 36 }}
                />
                <Stack sx={{ mr: 'auto', overflow: 'hidden' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                        {profile?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {profile?.email}
                    </Typography>
                </Stack>
            </Stack>
            <Divider />
            <MenuContent />
            <Divider />
            <Stack sx={{ p: 2 }}>
                <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
                    Exit
                </Button>
            </Stack>
        </Drawer>
    );
}