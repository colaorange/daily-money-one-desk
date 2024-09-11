import '@/App.css'
import dmoLogo from '@/assets/dmo.png'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import { TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useCallback, useMemo, useState } from 'react'
import { AuthroizationApi } from '@client/api'
import { Configuration } from '@client/configuration'
import { Fail } from '@client/models'
import { AxiosError } from 'axios'
import { MdSecurity } from 'react-icons/md';

function App() {

    const basePath = useMemo(() => {
        const url = new URL(window?.location.href);
        const searchParams = url.searchParams;
        return searchParams.get('connectionPoint') || `${url.protocol}://${url.hostname}:${url.port}`
    }, [])

    const [password, setPassword] = useState('')
    const [authResult, setAuthResult] = useState<{
        error?: boolean,
        message?: string
    }>()

    const doAuth = useCallback(async () => {
        const api = new AuthroizationApi(new Configuration({
            basePath,
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
    }, [basePath, password])
    return (<>
        <div>
            <img src={dmoLogo} className="logo" alt="Daily Money One logo" />
            <img src={viteLogo} className="logo" alt="Vite logo" />
            <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <h1>Daily Money One Desk</h1>
        <div className="card">
            <Typography>Connection Point : {basePath}</Typography>
            <MdSecurity size={40} style={{alignSelf: 'center'}} />
            <TextField variant='outlined' title='Connection Password' type='password' value={password} onChange={(evt) => {
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
