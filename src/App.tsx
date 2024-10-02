import '@/App.css';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { appErrMessage } from './appUtils';
import UnhandledErrorBoundary from './boundaries/UnhandledErrorBoundary';
import { UnhandledError } from './components/UnhandledError';
import AlertProvider from './contexts/AlertProvider';
import ApiProvider from './contexts/ApiProvider';
import I18nProvider from './contexts/I18nProvider';
import StoreProvider from './contexts/StoreProvider';
import ThemeProvider from './contexts/ThemeProvider';
import Router from './Router';

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
                    <UnhandledErrorBoundary>
                        <StoreProvider>
                            {children}
                        </StoreProvider>
                    </UnhandledErrorBoundary>
                </AlertProvider>
            </ThemeProvider>
        </I18nProvider>
    </ApiProvider>
}


export default App
