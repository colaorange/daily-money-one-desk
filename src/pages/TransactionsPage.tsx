import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type TransactionsPageProps = PropsWithChildren

export const TransactionsPage = memo(function AboutPage(props: TransactionsPageProps) {
    return <MainTemplate>
        <Typography>TransactionsPage</Typography>
    </MainTemplate>
})

export default TransactionsPage