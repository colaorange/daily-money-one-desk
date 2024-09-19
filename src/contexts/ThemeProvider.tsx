import Color from "color"
import { PropsWithChildren, createContext, memo, useMemo } from "react"
import { usePublicSetting } from "./useApi"
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from "@mui/material"

export type ThemeProviderProps = PropsWithChildren

export type ThemeContextValue = {
    theme: Theme,
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = memo(function ThemeProvider({ children }: ThemeProviderProps) {

    const { colorScheme } = usePublicSetting()

    const value = useMemo(() => {
        const theme = createTheme(colorScheme && {
            palette: {
                mode: colorScheme?.dark ? 'dark' : 'light',
                action: {
                    // 你可以在這裡自定義 hover、selected、disabled 等狀態的顏色
                },
                background: {
                    default: colorScheme.background,
                    paper: colorScheme.surface,
                },
                common: {
                    black: '#000000',
                    white: '#ffffff',
                },
                divider: Color(colorScheme.elevation.level5).rgb().toString(),
                error: {
                    main: colorScheme.error,
                    dark: Color(colorScheme.error).darken(0.3).rgb().toString(),
                    light: Color(colorScheme.error).lighten(0.3).rgb().toString(),
                    contrastText: colorScheme.onError
                },
                primary: {
                    main: colorScheme.primary,
                    dark: Color(colorScheme.primary).darken(0.3).rgb().toString(),
                    light: Color(colorScheme.primary).lighten(0.3).rgb().toString(),
                    contrastText: colorScheme.onPrimary
                },
                secondary: {
                    main: colorScheme.secondary,
                    dark: Color(colorScheme.secondary).darken(0.3).rgb().toString(),
                    light: Color(colorScheme.secondary).lighten(0.3).rgb().toString(),
                    contrastText: colorScheme.onSecondary
                },
                // success: {
                //     main: colorScheme.info,
                //     dark: colorScheme.onInfoContainer,
                //     light: colorScheme.infoContainer,
                //     contrastText: colorScheme.onInfo
                // },
                info: {
                    main: colorScheme.info,
                    dark: Color(colorScheme.info).darken(0.3).rgb().toString(),
                    light: Color(colorScheme.info).lighten(0.3).rgb().toString(),
                    contrastText: colorScheme.onInfo
                },
                warning: {
                    main: colorScheme.warn,
                    dark: Color(colorScheme.warn).darken(0.3).rgb().toString(),
                    light: Color(colorScheme.warn).lighten(0.3).rgb().toString(),
                    contrastText: colorScheme.onWarn
                },
                text: {
                    primary: colorScheme.onBackground,
                    secondary: colorScheme.onSurface,
                    disabled: colorScheme.surfaceDisabled
                },
            },
            components: {
                MuiSelect: {
                    styleOverrides: {
                        root: {
                            height: 46
                        },
                    }
                }
            }
        });
        return { theme }
    }, [colorScheme])


    return <ThemeContext.Provider value={value} >
        <MuiThemeProvider theme={value.theme}>
            {children}
        </MuiThemeProvider>
    </ThemeContext.Provider>
})


export default ThemeProvider