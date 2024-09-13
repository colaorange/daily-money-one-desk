import '@/App.css'
import dmoLogo from '@/assets/dmo.png'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import { BasicApi, BookApi } from '@client/api'
import { Configuration } from '@client/configuration'
import { Fail } from '@client/model'
import { TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { AxiosError } from 'axios'
import { memo, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { MdSecurity } from 'react-icons/md'

export type LandingProps = PropsWithChildren

export const Landing = memo(function Landing(props: LandingProps) {
    const basePath = useMemo(() => {
        const url = new URL(window?.location.href);
        const searchParams = url.searchParams;
        return searchParams.get('connectionPoint') || `${url.protocol}//${url.hostname}:${url.port}`
    }, [])

    const [password, setPassword] = useState('')
    const [authResult, setAuthResult] = useState<{
        error?: boolean,
        message?: string
    }>()

    const doError = useCallback((err: unknown) => {
        if (err instanceof AxiosError) {
            //will undefine when network error
            const fail: Fail = err.response?.data
            setAuthResult({
                error: true,
                message: (fail && fail.message) ? `${fail.message} (${fail.code})` : err.message
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
    }, [])

    const doQueryInfo = useCallback(async () => {
        const api = new BookApi(new Configuration({
            basePath,
            apiKey: password
        }))
        try {
            const books = (await api.listBook()).data
            setAuthResult({
                message: `There are books: ${books?.map((b) => b.name).join(', ')}`
            })
        } catch (err) {
            doError(err)
        }
    }, [basePath, doError, password])

    const doAuth = useCallback(async () => {
        const api = new BasicApi(new Configuration({
            basePath,
        }))
        try {
            const result = (await api.authorize(password)).data
            if (!result.error) {
                setAuthResult({
                    message: 'Authroized, Getting information...'
                })
                doQueryInfo()
            }
        } catch (err) {
            doError(err)
        }
    }, [basePath, password, doError, doQueryInfo])

    return (<>
        <div>
            <img src={dmoLogo} className="logo dmo" alt="Daily Money One logo" />
            <img src={viteLogo} className="logo" alt="Vite logo" />
            <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <h1>Daily Money One Desk</h1>
        <div className="card">
            <Typography>Connection Point : {basePath}</Typography>
            <MdSecurity size={40} style={{ alignSelf: 'center' }} />
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
})

export default Landing