import utilStyles from "@/utilStyles"
import { css } from '@emotion/react'
import { Button, Typography, useTheme } from "@mui/material"
import { clsx } from "clsx"
import { memo, useMemo } from "react"
import { BiSolidError } from "react-icons/bi"

/**
 * a full screen error indicator for initialization
 */
export const InitError = memo(function InitError({ message }: { message: string }) {

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