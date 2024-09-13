import '@/App.css';
import { createTheme, ThemeProvider, Typography } from '@mui/material';

import clsx from 'clsx';
import { Link1, Link2 } from './components/styled';
import utilStyles from './utilStyles';
import { Link3 } from './components/themed';
import Landing from './pages/Landing';

const defaultTheme = createTheme({});


function App() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Landing />
            {/* <div className={clsx(utilStyles.vlayout)} >
                <Link1>abc</Link1>
                <Link2>def</Link2>
                <Link3>xyz</Link3>
                <Typography>A</Typography>
                <Typography>B</Typography>
                <Typography>C</Typography>
            </div> */}
        </ThemeProvider>
    )
}

export default App
