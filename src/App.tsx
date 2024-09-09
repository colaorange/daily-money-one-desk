import '@/App.css'
import reactLogo from '@/assets/react.svg'
import moment from 'moment'
import { useState } from 'react'
import dmoLogo from '/dmo.png'
import viteLogo from '/vite.svg'
import Button from '@mui/material/Button'
// import {Button} from '@mui/material'

function App() {
    const [count, setCount] = useState(0)
    return (<>
        <div>
            <img src={dmoLogo} className="logo" alt="Daily Money One logo" />
            <img src={viteLogo} className="logo" alt="Vite logo" />
            <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <h1>Daily Money One Desk</h1>
        <div className="card">
            <Button variant="contained" onClick={() => setCount((count) => count + 1)}>
                count is {count}, time is {moment().toString()}
            </Button>
        </div>
    </>)
}

export default App
