import '@/App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { appErrMessage } from './appUtils';
import { UnhandledError } from './components/UnhandledError';
import AlertProvider, { AlertLevel } from './contexts/AlertProvider';
import ApiProvider from './contexts/ApiProvider';
import I18nProvider from './contexts/I18nProvider';
import useAlert from './contexts/userAlert';
import Router from './Router';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';

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

    return <ThemeProvider theme={defaultTheme}>
        <ErrorBoundary fallbackRender={fallbackRender}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </ErrorBoundary>
    </ThemeProvider>
}

//TODO weakref
let lastUnhandledError: any

function AppBoundary2({ children }: PropsWithChildren) {
    const alert = useAlert()

    const onUnhandledError = useCallback((evt: ErrorEvent) => {
        const { error } = evt
        if (lastUnhandledError !== error) {
            lastUnhandledError = error
            alert.push({
                message: `Error : ${appErrMessage(error).message}`,
                level: AlertLevel.ERROR
            })
        }
    }, [alert])
    const onUnhandledRejection = useCallback((evt: PromiseRejectionEvent) => {
        const { reason } = evt
        if (lastUnhandledError !== reason) {
            lastUnhandledError = reason
            alert.push({
                message: `Promise Rejection : ${appErrMessage(reason).message}`,
                level: AlertLevel.ERROR
            })
        }
    }, [alert])

    useEffect(() => {
        window.addEventListener('error', onUnhandledError)
        window.addEventListener('unhandledrejection', onUnhandledRejection)
        return () => {
            window.removeEventListener('error', onUnhandledError)
            window.removeEventListener('unhandledrejection', onUnhandledRejection)
        }
    }, [onUnhandledError, onUnhandledRejection])

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
            {children}
        </I18nProvider>
    </ApiProvider>
}


export default App
