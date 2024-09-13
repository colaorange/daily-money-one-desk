import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type Page2Props = PropsWithChildren

export const Page2 = memo(function Page2(props: Page2Props) {
    return <div>
        <Typography>Page2</Typography>
    </div>
})

export default Page2