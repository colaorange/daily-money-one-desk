import utilStyles from "@/utilStyles"
import CircularProgress from '@mui/material/CircularProgress';
import { memo } from "react"

/**
 * a full screen loading indicator for initialization
 */
export const InitLoading = memo(function InitLoading() {
    return <div css={[utilStyles.vclayout, utilStyles.fill]}>
        <CircularProgress />
    </div>
})