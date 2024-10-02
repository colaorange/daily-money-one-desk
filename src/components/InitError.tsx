import utilStyles from "@/utilStyles";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { css, useTheme } from '@mui/material/styles';
import { memo, useMemo } from "react";
import { BiSolidError } from "react-icons/bi";

/**
 * a full screen error indicator for initialization,
 */
export const InitError = memo(function InitError({ message }: { message: string }) {

    //not in our theme scope
    const theme = useTheme()
    const styles = useMemo(() => {
        return {
            errTxtSty: css({
                color: theme.palette.error.main
            })
        }
    }, [theme])

    return <div css={[utilStyles.vclayout, utilStyles.fill]} style={{ gap: theme.spacing(1) }}>
        <BiSolidError size={64} css={styles.errTxtSty} />
        <Typography variant="subtitle1" css={styles.errTxtSty}>{`<ERROR>`}</Typography>
        <Typography variant="body1">{message}</Typography>

        <div style={{ paddingTop: 20 }} />
        <Button variant="contained" onClick={() => {
            window.location.reload()
        }}>Try Again</Button>
    </div>
})