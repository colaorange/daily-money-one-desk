import { useI18nLabel } from "@/contexts/useI18n";
import utilStyles from "@/utilStyles";
import { css } from '@emotion/react';
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { memo, useMemo } from "react";
import { BiDonateBlood, BiDonateHeart, BiHeart, BiSolidHeart } from "react-icons/bi";
import { LuConstruction } from "react-icons/lu";
/**
 * 
 */
export const UnderConsturction = memo(function UnderConsturction({ message }: { message?: string }) {

    const ll = useI18nLabel()
    const theme = useTheme()
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

    return <Box
        css={styles.root}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        <LuConstruction size={64} css={styles.txtSty} />
        <Typography variant="subtitle1" css={styles.txtSty}>{`<${ll('underConstruction')}>`}</Typography>
        <Typography variant="body1" css={styles.txtSty}>{message || ll('message.underConstruction')}</Typography>
        <Stack direction={'row'} alignItems={'center'}>
            <BiSolidHeart size={16} />
            <Typography variant="caption" >{ll('desktop.underConstruction')}</Typography>
            <BiSolidHeart size={16} />
        </Stack>
    </Box>
})