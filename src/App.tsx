import '@/App.css';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { appErrMessage } from './appUtils';
import { UnhandledError } from './components/UnhandledError';
import AlertProvider, { AlertLevel } from './contexts/AlertProvider';
import ApiProvider from './contexts/ApiProvider';
import I18nProvider from './contexts/I18nProvider';
import useAlert from './contexts/userAlert';
import Router from './Router';
import ThemeProvider from './contexts/ThemeProvider';

const defaultTheme = createTheme({});


function App() {
    return (<AppBoundary1>
        <AppBoundary2>
            <Router />
        </AppBoundary2>
    </AppBoundary1>
    )
}

function AppBoundary1({ children }: PropsWithChildren) {

    const fallbackRender = useCallback(({ error }: FallbackProps) => {
        return <UnhandledError message={appErrMessage(error).message} />
    }, [])

    return <MuiThemeProvider theme={defaultTheme}>
        <ErrorBoundary fallbackRender={fallbackRender}>
            {children}
        </ErrorBoundary>
    </MuiThemeProvider>
}


function AppBoundary2({ children }: PropsWithChildren) {

    const { basePath, custom } = useMemo(() => {
        const url = new URL(window?.location.href);
        const searchParams = url.searchParams;
        const basePath = searchParams.get('apiBasePath')
        return basePath ? {
            basePath,
            custom: true
        } : {
            basePath: `${url.protocol}//${url.hostname}:${url.port}`
        }
    }, [])

    return <ApiProvider basePath={basePath} custom={custom}>
        <I18nProvider>
            <ThemeProvider>
                <AlertProvider>
                    {children}
                </AlertProvider>
            </ThemeProvider>
        </I18nProvider>
    </ApiProvider>
}


export default App
