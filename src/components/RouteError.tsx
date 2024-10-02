import { appErrMessage } from "@/appUtils";
import { useI18nLabel } from "@/contexts/useI18n";
import utilStyles from "@/utilStyles";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { css } from '@mui/material/styles';
import { memo, useMemo } from "react";
import { BiSolidError } from "react-icons/bi";
import { BsFillQuestionCircleFill, BsSignStop } from "react-icons/bs";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
/**
 * a full screen error indicator for initialization
 */
export const RouteError = memo(function RouteError() {

    const ll = useI18nLabel()
    const error = useRouteError();
    const navigate = useNavigate()

    let message: string
    let title: string
    let statusCode: number = 0

    if (isRouteErrorResponse(error)) {
        message = `${error.status} ${error.statusText}`
        statusCode = error.status
        title = `<WARNING>`
    } else {
        message = appErrMessage(error, ll).message
        title = `<ERROR>`
    }

    const theme = useTheme()
    const styles = useMemo(() => {

        let color: string
        if (statusCode === 404 || statusCode === 403) {
            color = theme.palette.warning.main
        } else {
            color = theme.palette.error.main
        }

        return {
            errTxtSty: css({
                color
            })
        }
    }, [theme, statusCode])



    return <Box
        css={[utilStyles.vclayout, utilStyles.fill]}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        {(() => {
            if (statusCode === 404) {
                return <BsFillQuestionCircleFill size={64} css={styles.errTxtSty} />
            } else if (statusCode === 403) {
                return <BsSignStop size={64} css={styles.errTxtSty} />
            }
            return <BiSolidError size={64} css={styles.errTxtSty} />
        })()}

        <Typography variant="subtitle1" css={styles.errTxtSty}>{title}</Typography>
        <Typography variant="body1">{message}</Typography>

        <div style={{ paddingTop: 20 }} />
        <div css={[utilStyles.hlayout]} style={{ gap: theme.spacing(1) }}>
            <Button variant="contained" onClick={() => {
                window.location.reload()
            }}>{ll('action.tryAgain')}</Button>
            <Button variant="contained" onClick={() => {
                navigate('/')
            }}>{ll('desktop.home')}</Button>
        </div>
    </Box>
})