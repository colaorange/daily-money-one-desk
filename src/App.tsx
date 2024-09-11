import '@/App.css'
import reactLogo from '@/assets/react.svg'
import dmoLogo from '@/assets/dmo.png'
import viteLogo from '@/assets/vite.svg'
import moment from 'moment'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
// import {Button} from '@mui/material'
import { AuthroizationApi, Fail } from '@client/api'
import { Configuration } from '@client/configuration'
import { AxiosError } from 'axios'

function App() {
    const [count, setCount] = useState(0)

    const [password, setPassword] = useState('')

    const [authResult, setAuthResult] = useState<{
        error?: boolean,
        message?: string
    }>()

    const doAuth = async () => {
        const api = new AuthroizationApi(new Configuration({
            basePath: 'http://127.0.0.1:8080',
            apiKey: password
        }))
        try {
            const result = await api.authroizeGet()
            setAuthResult({
                message: result.data.message
            })
        } catch (err) {
            if (err instanceof AxiosError) {
                const fail: Fail = err.response?.data
                setAuthResult({
                    error: true,
                    message: fail.message || err.message
                })
            } else if (err instanceof Error) {
                setAuthResult({
                    error: true,
                    message: err.message
                })
            } else {
                setAuthResult({
                    error: true,
                    message: JSON.stringify(err)
                })
            }
        }
    }
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
            <TextField value={password} onChange={(evt) => {
                setPassword(evt.target.value)
                setAuthResult({})
            }}
                error={!!authResult?.error}
                helperText={authResult?.message}
            />
            <Button variant="contained" onClick={doAuth}>
                Authorize
            </Button>
        </div>
    </>)
}

export default App
