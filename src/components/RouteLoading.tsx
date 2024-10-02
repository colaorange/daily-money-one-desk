import useTheme from "@/contexts/useTheme";
import utilStyles from "@/utilStyles";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from "react";

/**
 * a full screen loading indicator for routing
 */
export const RouteLoading = memo(function RouteLoading() {
    const { theme } = useTheme()
    return <Box
        css={[utilStyles.vclayout, utilStyles.fill]}
        sx={{
            gap: theme.spacing(1), color: theme.palette.text.primary,
            bgcolor: theme.palette.background.default
        }}>
        <CircularProgress />
    </Box>
})