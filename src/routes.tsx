import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { createRoutesFromElements, Route } from "react-router-dom";
import { RouteError } from "./components/RouteError";


export const route = <Route errorElement={<RouteError />} >
    <Route path="/" Component={HomePage} />
    <Route path="/about" Component={AboutPage} />

</Route>


export const routes = createRoutesFromElements(route)