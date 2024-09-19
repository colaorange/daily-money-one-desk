import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type BalanceSheetsPageProps = PropsWithChildren

export const BalanceSheetsPage = memo(function AboutPage(props: BalanceSheetsPageProps) {
    return <MainTemplate>
        <Typography>BalanceSheetsPage</Typography>
    </MainTemplate>
})

export default BalanceSheetsPage