import utilStyles from "@/utilStyles"
import { css } from '@emotion/react'
import { Box, Button, Typography, useTheme } from "@mui/material"
import { memo, useMemo } from "react"
import { AiFillBug } from "react-icons/ai";

/**
 * a full screen error indicator for initialization
 */
export const UnhandledError = memo(function UnhandledError({ message }: { message: string }) {

    const theme = useTheme()
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