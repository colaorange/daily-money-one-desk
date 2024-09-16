import '@/App.css';
import { createTheme, css, keyframes, ThemeProvider } from '@mui/material';

import { useMemo } from 'react';
import ApiProvider from './contexts/ApiProvider';
import I18nProvider from './contexts/I18nProvider';
import Landing from './pages/Landing';

const defaultTheme = createTheme({});


function App() {
    const { apiBasePath, custom } = useMemo(() => {
        const url = new URL(window?.location.href);
        const searchParams = url.searchParams;
        const apiBasePath = searchParams.get('apiBasePath')
        return apiBasePath ? {
            apiBasePath,
            custom: true
        } : {
            apiBasePath: `${url.protocol}//${url.hostname}:${url.port}`
        }
    }, [])
    return (
        <ThemeProvider theme={defaultTheme}>
            {/* <div css={style}>ABC</div> */}
            <ApiProvider basePath={apiBasePath} custom={custom}>
                <I18nProvider>
                    <Landing />
                </I18nProvider>
            </ApiProvider>
        </ThemeProvider>
    )
}

export default App
