import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type TrendChartsPageProps = PropsWithChildren

export const TrendChartsPage = memo(function AboutPage(props: TrendChartsPageProps) {
    return <MainTemplate>
        <Typography>TrendChartsPage</Typography>
    </MainTemplate>
})

export default TrendChartsPage