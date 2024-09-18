import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type AboutPageProps = PropsWithChildren

export const AboutPage = memo(function AboutPage(props: AboutPageProps) {
    return <div>
        <Typography>About</Typography>
    </div>
})

export default AboutPage