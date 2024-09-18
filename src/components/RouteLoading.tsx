import utilStyles from "@/utilStyles"
import { CircularProgress } from "@mui/material"
import { clsx } from "clsx"
import { memo } from "react"

/**
 * a full screen loading indicator for routing
 */
export const RouteLoading = memo(function RouteLoading() {
    return <div css={[utilStyles.vclayout, utilStyles.fill]}>
        <CircularProgress />
    </div>
})