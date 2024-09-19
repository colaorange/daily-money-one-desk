import { useContext } from "react"
import { ThemeContext, ThemeContextValue } from "./ThemeProvider"

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within an ThemeProvider")
    }
    return context
}

export default useTheme