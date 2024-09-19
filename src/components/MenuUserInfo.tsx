import useApi from '@/contexts/useApi';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function MenuUserInfo() {

    const { preferences } = useApi()
    const { profile } = preferences || {}

    return (<Stack
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
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'primar.contrastText' }}
        />
        <Stack sx={{ mr: 'auto', overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                {profile?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {profile?.email}
            </Typography>
        </Stack>
    </Stack>);
}