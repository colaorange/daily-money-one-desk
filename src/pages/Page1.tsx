import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type Page1Props = PropsWithChildren

export const Page1 = memo(function Page1(props: Page1Props) {
    return <div>
        <Typography>Page1</Typography>
    </div>
})

export default Page1