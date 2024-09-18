import useApi from "@/contexts/useApi";
import { memo, PropsWithChildren } from "react";
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { RouteLoading } from "./components/RouteLoading";
import Landing from "./Landing";
import { routes } from "./routes";



const router = createHashRouter(routes);


export type RouterProps = PropsWithChildren

export const Router = memo(function Router(props: RouterProps) {
    const api = useApi()
    if (!api.authorized) {
        return <Landing />
    }

    return <RouterProvider router={router} fallbackElement={<RouteLoading />} />
})

export default Router