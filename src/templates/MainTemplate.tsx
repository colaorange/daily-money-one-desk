import AppNavbar from "@/components/AppNavbar"
import SideMenu from "@/components/SideMenu"
import utilStyles from "@/utilStyles"

import { Box, css, useTheme } from "@mui/material"
import { memo, PropsWithChildren, useMemo } from "react"

export type MainTemplateProps = PropsWithChildren

export const MainTemplate = memo(function MainTemplate(props: MainTemplateProps) {
    const { children } = props

    const theme = useTheme()

    const styles = useMemo(() => {
        return {
            main: css(utilStyles.vlayout, utilStyles.flex1, {
                alignItems: 'flex-start'
            })
        }
    }, [])


    return <Box sx={{
        display: 'flex',
        paddingTop: { xs: `calc(${theme.mixins.toolbar.minHeight}px + 2px)`, md: 0 },
        minHeight: '100vh',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.background.default
    }}>
        <SideMenu />
        <AppNavbar />
        <main css={styles.main}>
        {children}
    </main>
    </Box >
})

export default MainTemplate