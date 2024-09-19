import Color from "color"
import { PropsWithChildren, createContext, memo, useMemo } from "react"
import { usePublicSetting } from "./useApi"
import { createTheme, Theme, css, ThemeProvider as MuiThemeProvider } from "@mui/material"
import { ColorScheme } from "@client/model"
import { SerializedStyles } from "@emotion/react"

export type ThemeProviderProps = PropsWithChildren


export type AppColorScheme = {
    navbarBgColor: string
    toolbarBgColor: string
    notouchedOutline: string
}

export type AppStyles = {
    outlineIconButton: SerializedStyles
}

export type ThemeContextValue = {
    theme: Theme,
    colorScheme: ColorScheme
    appColorScheme: AppColorScheme
    appStyles: AppStyles
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = memo(function ThemeProvider({ children }: ThemeProviderProps) {

    const { colorScheme } = usePublicSetting()

    const value = useMemo(() => {
        const toolbarMinHeight = 64
        const defaultTheme = createTheme({})
        const theme = createTheme({
            mixins: {
                toolbar: {
                    minHeight: toolbarMinHeight
                }
            },
            palette: {
                mode: colorScheme?.dark ? 'dark' : 'light',
                action: {
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
                MuiOutlinedInput: {
                    styleOverrides: {
                        notchedOutline: {
                            border: `1px solid ${colorScheme.outline}`
                        }
                    },
                },
                MuiSelect: {
                    styleOverrides: {
                        root: {
                            height: 46,
                        },
                    }
                },
                MuiToolbar: {
                    styleOverrides: {
                        root: {
                            //[prevent height change in xs and sm]
                            height: toolbarMinHeight,
                            minHeight: toolbarMinHeight,
                            [defaultTheme.breakpoints.down('sm')]: {
                                height: toolbarMinHeight,
                                minHeight: toolbarMinHeight,
                            },
                            [defaultTheme.breakpoints.down('xs')]: {
                                height: toolbarMinHeight,
                                minHeight: toolbarMinHeight,
                            },
                        }
                    }
                }
            }
        });
        const appColorScheme: AppColorScheme = {
            navbarBgColor: colorScheme.primaryContainer,
            toolbarBgColor: colorScheme.elevation.level1,
            notouchedOutline: colorScheme.outline

        }
        const appStyles: AppStyles = {
            outlineIconButton: css({
                borderRadius: theme.spacing(0.5),
                height: 46,
                width: 46,
                border: '1px solid',
                borderColor: appColorScheme.notouchedOutline,
                ':hover': {
                    borderColor: theme.palette.common.white,
                },
                ':active': {
                    borderWidth: '2px',
                    borderColor: theme.palette.primary.main,
                },
                ':focus': {
                    borderWidth: '2px',
                    borderColor: theme.palette.primary.main,
                },
                //stronger name
                '& .MuiTouchRipple-root .MuiTouchRipple-child': {
                    borderRadius: theme.spacing(0.5),
                }
            })
        }
        return {
            theme,
            colorScheme,
            appColorScheme,
            appStyles
        }
    }, [colorScheme])


    return <ThemeContext.Provider value={value} >
        <MuiThemeProvider theme={value.theme}>
            {children}
        </MuiThemeProvider>
    </ThemeContext.Provider>
})


export default ThemeProvider