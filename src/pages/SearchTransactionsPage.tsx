import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { PropsWithChildren } from "react"

export type SearchTransactionsPageProps = PropsWithChildren

export const SearchTransactionsPage = observer(function AboutPage(props: SearchTransactionsPageProps) {
    return <MainTemplate>
        <Typography>SearchTransactionsPage</Typography>
    </MainTemplate>
})

export default SearchTransactionsPage