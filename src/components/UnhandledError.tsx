import useTheme from "@/contexts/useTheme";
import utilStyles from "@/utilStyles";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { css } from '@mui/material/styles';
import { memo, useMemo } from "react";
import { AiFillBug } from "react-icons/ai";

/**
 * a full screen error indicator for initialization
 */
export const UnhandledError = memo(function UnhandledError({ message }: { message: string }) {

    const { theme } = useTheme()
    const styles = useMemo(() => {
        return {
            errTxtSty: css({
                color: theme.palette.error.main
            })
        }
    }, [theme])

    return <Box
        css={[utilStyles.vclayout, utilStyles.fill]}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        <AiFillBug size={64} css={styles.errTxtSty} />
        <Typography variant="subtitle1" css={styles.errTxtSty}>{`<ERROR>`}</Typography>
        <Typography variant="body1">{message}</Typography>

        <div style={{ paddingTop: 20 }} />
        <Button variant="contained" onClick={() => {
            window.location.reload()
        }}>Try Again</Button>
    </Box>
})