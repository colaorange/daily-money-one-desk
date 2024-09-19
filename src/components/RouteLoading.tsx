import utilStyles from "@/utilStyles"
import { Box, CircularProgress, useTheme } from "@mui/material"
import { memo } from "react"

/**
 * a full screen loading indicator for routing
 */
export const RouteLoading = memo(function RouteLoading() {
    const theme = useTheme()
    return <Box
        css={[utilStyles.vclayout, utilStyles.fill]}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        <CircularProgress />
    </Box>
})