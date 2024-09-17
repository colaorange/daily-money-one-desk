import useApi from "@/contexts/useApi"
import { Typography } from "@mui/material"
import { memo, PropsWithChildren } from "react"
import Landing from "./Landing"

export type MainProps = PropsWithChildren

export const Main = memo(function Page1(props: MainProps) {
    const api = useApi()
    if (!api.authorized) {
        return <Landing />
    }

    return <div>
        <Typography>Main</Typography>
    </div>
})

export default Main