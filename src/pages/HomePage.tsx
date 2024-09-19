import MainTemplate from "@/templates/MainTemplate"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"

export type HomePageProps = PropsWithChildren

export const HomePage = memo(function HomePage(props: HomePageProps) {
    return <MainTemplate>
        <Typography>Home</Typography>
        <div style={{height: '200vh'}}/>
    </MainTemplate>
})

export default HomePage