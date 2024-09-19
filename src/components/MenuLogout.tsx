import useApi from '@/contexts/useApi';
import { useI18nLabel } from '@/contexts/useI18n';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';



export default function MenuLogout() {

    const { setAuhtorization } = useApi()
    const ll = useI18nLabel()

    return (<Stack sx={{ p: 2 }}>
        <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={() => {
            setAuhtorization(undefined)
        }}>
            {ll('action.exit')}
        </Button>
    </Stack>);
}