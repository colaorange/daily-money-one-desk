import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type SearchTransactionsPageProps = PropsWithChildren

export const SearchTransactionsPage = memo(function AboutPage(props: SearchTransactionsPageProps) {
    return <MainTemplate>
        <Typography>SearchTransactionsPage</Typography>
    </MainTemplate>
})

export default SearchTransactionsPage