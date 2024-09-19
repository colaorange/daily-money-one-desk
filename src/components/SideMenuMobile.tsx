import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useApi from '@/contexts/useApi';
import { Box } from '@mui/material';
import MenuContent from './MenuContent';
import { useI18nLabel } from '@/contexts/useI18n';

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {

    const { preferences, setAuhtorization } = useApi()
    const { profile } = preferences || {}
    const ll = useI18nLabel()

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    backgroundImage: 'none',
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Stack
                sx={{
                    maxWidth: '70dvw',
                    height: '100%',
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
                    <Box sx={{ mr: 'auto' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                            {profile?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'inline-block', wordBreak: 'break-all' }}>
                            {profile?.email}
                        </Typography>
                    </Box>
                </Stack>
                <Divider />
                <Stack sx={{ flexGrow: 1 }}>
                    <MenuContent />
                    <Divider />
                </Stack>
                <Stack sx={{ p: 2 }}>
                    <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={() => {
                        setAuhtorization(undefined)
                    }}>
                        {ll('action.exit')}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}