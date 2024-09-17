import { PropsWithChildren, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import App from '@/App'

createRoot(document.getElementById('root')!).render(
    <MainStrictMode off>
        <CssBaseline />
        <App />
    </MainStrictMode>,
)


// eslint-disable-next-line react-refresh/only-export-components
function MainStrictMode({ children, off }: PropsWithChildren<{ off?: boolean }>) {
    return off ? children : <StrictMode>{children}</StrictMode>
}