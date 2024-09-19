import HomePage from "./pages/HomePage";
import BalanceSheetsPage from "./pages/BalanceSheetsPage";
import { createRoutesFromElements, Route } from "react-router-dom";
import { RouteError } from "./components/RouteError";
import TrendChartsPage from "./pages/TrendChartsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SearchTransactionsPage from "./pages/SearchTransactionsPage";


export const route = <Route errorElement={<RouteError />} >
    <Route path="/" Component={HomePage} />
    <Route path="/balance-sheets" Component={BalanceSheetsPage} />
    <Route path="/trend-charts" Component={TrendChartsPage} />
    <Route path="/transactions" Component={TransactionsPage} />
    <Route path="/search-transactions" Component={SearchTransactionsPage} />

</Route>


export const routes = createRoutesFromElements(route)