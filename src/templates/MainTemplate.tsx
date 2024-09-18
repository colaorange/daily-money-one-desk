import AppNavbar from "@/components/AppNavbar"
import SideMenu from "@/components/SideMenu"

import { Box, Stack, useTheme } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type MainTemplateProps = PropsWithChildren

export const MainTemplate = memo(function MainTemplate(props: MainTemplateProps) {
    const { children } = props

    const theme = useTheme()

    return <Box sx={{ display: 'flex', paddingTop: { xs: `calc(${theme.mixins.toolbar.minHeight}px + 2px)`, md: 0 } }}>
        <SideMenu />
        <AppNavbar />
        <main>
            {children}
        </main>
    </Box>
})

export default MainTemplate