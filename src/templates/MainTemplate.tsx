import AppNavbar from "@/components/AppNavbar";
import SideMenu from "@/components/SideMenu";
import useTheme from "@/contexts/useTheme";
import utilStyles from "@/utilStyles";

import Box from '@mui/material/Box';
import { css, SxProps, Theme } from '@mui/material/styles';


import { memo, PropsWithChildren, useMemo } from "react";

export type MainTemplateProps = PropsWithChildren

export const MainTemplate = memo(function MainTemplate(props: MainTemplateProps) {
    const { children } = props

    const { theme } = useTheme()

    const styles = useMemo(() => {
        return {
            rootSx: {
                display: 'flex',
                paddingTop: { xs: `calc(${theme.mixins.toolbar.minHeight}px)`, sm: `calc(${theme.mixins.toolbar.minHeight}px)`, md: 0 },
                height: '100vh',
                color: theme.palette.text.primary,
                bgcolor: theme.palette.background.default,
            } as SxProps<Theme>,
            main: css(utilStyles.vlayout, utilStyles.flex1, {
                alignItems: 'flex-start',
                overflowX: 'hidden',
                overflowY: 'auto'
            })
        }
    }, [theme])


    return <Box sx={styles.rootSx}>
        <SideMenu />
        <AppNavbar />
        <main css={styles.main}>
            {children}
        </main>
    </Box >
})

export default MainTemplate