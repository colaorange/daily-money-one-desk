
import CircularProgress from '@mui/material/CircularProgress';
import Stack, { StackProps } from '@mui/material/Stack';
import { css } from '@mui/material/styles';
import { memo, useEffect, useMemo, useState } from "react";

/**
 * a full parent loading indicator for container initialization
 */
export const FullLoading = memo(function FullLoading(props: StackProps & { delay?: number }) {

    const { delay, ...rest } = props


    const [loading, setLoading] = useState(delay ? false : true)


    useEffect(() => {
        const t = delay && delay > 0 && setTimeout(() => {
            setLoading(true)
        }, delay)
        return t ? (() => {
            clearTimeout(t)
        }) : undefined
    }, [delay])

    const styles = useMemo(() => {
        return {
            root: css({
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'stretch'
            }),
        }
    }, [])



    return <Stack css={styles.root} {...rest}>
        {loading && <CircularProgress />}
    </Stack>
})