import useApi from "@/contexts/useApi";
import { useI18nLabel } from "@/contexts/useI18n";
import useTheme from "@/contexts/useTheme";
import utilStyles from "@/utilStyles";
import { BasicApi } from "@client/api";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { css } from '@mui/material/styles';
import { memo, useCallback, useMemo } from "react";
import { BiSolidHeart } from "react-icons/bi";
import { LuConstruction } from "react-icons/lu";
/**
 * 
 */
export const UnderConsturction = memo(function UnderConsturction({ message }: { message?: string }) {

    const ll = useI18nLabel()
    const api = useApi()
    const { theme } = useTheme()
    const styles = useMemo(() => {
        return {
            root: css(utilStyles.vclayout, {
                alignSelf: 'stretch',
                flex: 1,
            }),
            txtSty: css({
                color: theme.palette.warning.main
            })
        }
    }, [theme])

    const onWatchAds = useCallback(() => {
        if (api.authorized) {
            new BasicApi(api.configuration()).watchAds().catch(() => {
                //eat
            })
        }
    }, [api])

    return <Box
        css={styles.root}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        <LuConstruction size={64} css={styles.txtSty} />
        <Typography variant="subtitle1" css={styles.txtSty}>{`<${ll('underConstruction')}>`}</Typography>
        <Typography variant="body1" css={styles.txtSty}>{message || ll('message.underConstruction')}</Typography>
        <Stack direction={'row'} alignItems={'center'} padding={theme.spacing(1)}>
            <BiSolidHeart size={16} />
            <Typography variant="caption" >{ll('desktop.underConstruction')}</Typography>
            <BiSolidHeart size={16} />
        </Stack>
        {api.authorized && <Button color="primary" onClick={onWatchAds}>{ll('desktop.watchAds')}</Button>}
    </Box>
})