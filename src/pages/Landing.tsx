import '@/App.css'
import dmoLogo from '@/assets/dmo.png'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import useApi from '@/contexts/useApi'
import { useI18nLabel } from '@/contexts/useI18n'
import utilStyles from '@/utilStyles'
import { BasicApi, BookApi } from '@client/api'
import { Configuration } from '@client/configuration'
import { Fail } from '@client/model'
import { keyframes, css } from '@emotion/react'
import { TextField, Typography, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import { AxiosError } from 'axios'
import { memo, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { MdSecurity } from 'react-icons/md'

export type LandingProps = PropsWithChildren

export const Landing = memo(function Landing(props: LandingProps) {
    const { basePath, custom } = useApi()
    const ll = useI18nLabel()
    const theme = useTheme()

    const [connectionToken, setConnectionToken] = useState('')
    const [authResult, setAuthResult] = useState<{
        error?: boolean,
        message?: string
    }>()

    const doError = useCallback((err: any) => {
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
            apiKey: connectionToken
        }))
        try {
            const books = (await api.listBook()).data
            setAuthResult({
                message: `There are books: ${books?.map((b) => b.name).join(', ')}`
            })
        } catch (err) {
            doError(err)
        }
    }, [basePath, doError, connectionToken])

    const doAuth = useCallback(async () => {
        const api = new BasicApi(new Configuration({
            basePath,
        }))
        try {
            const result = (await api.authorize(connectionToken)).data
            if (!result.error) {
                setAuthResult({
                    message: 'Authroized, Getting information...'
                })
                doQueryInfo()
            } else {
                setAuthResult({
                    error: true,
                    message: ll('desktop.wrongConnectionToken')
                })
            }
        } catch (err) {
            doError(err)
        }
    }, [basePath, connectionToken, doError, doQueryInfo, ll])

    const styles = useMemo(() => {
        const logoSpin = keyframes({
            from: {
                transform: `rotate(0deg)`
            },
            to: {
                transform: `rotate(360deg)`
            }
        })
        return {
            root: css({
                paddingTop: 100
            }),
            logo: css({
                height: '6em',
                padding: '1.5em',
                willChange: 'filter',
                transition: 'filter 300ms',
                ':hover': {
                    filter: 'drop-shadow(0 0 2em #6100feaa)'
                },

            }),
            react: css({
                animation: `${logoSpin} infinite 10s linear`,
                ':hover': {
                    filter: 'drop-shadow(0 0 2em #545cffaa)'
                },
            }),
            dmo: css({
                ':hover': {
                    filter: 'drop-shadow(0 0 2em #61fa6baa)'
                },
            }),
            card: css({
                padding: '2em',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                width: `min(100vw, 500px)`
            })
        }
    }, [])

    return (<div css={[utilStyles.vlayout, styles.root]}>
        <div>
            <img src={dmoLogo} css={[styles.logo, styles.dmo]} alt="Daily Money One logo" />
            <img src={viteLogo} css={styles.logo} alt="Vite logo" />
            <img src={reactLogo} css={[styles.logo, styles.react]} alt="React logo" />
        </div>
        <Typography variant='h3'>{ll('appName')}</Typography>
        <Typography variant='h3'>{ll('desktop')}</Typography>
        <form onSubmit={(evt) => {
            evt.preventDefault()
            doAuth()
        }}>
            <div css={styles.card}>
                <MdSecurity size={90} style={{ alignSelf: 'center', margin: 50 }} />
                {custom && <Typography align='center'>{ll('desktop.connectionUrl')} : {basePath}</Typography>}
                <TextField label={ll('serverMode.connectionToken')} variant='outlined' type='password' value={connectionToken} onChange={(evt) => {
                    setConnectionToken(evt.target.value)
                    setAuthResult({})
                }}
                    error={!!authResult?.error}
                    helperText={authResult?.message}
                />
                <Button variant="contained" onClick={doAuth}>
                    {ll('action.authorize')}
                </Button>
            </div>
        </form>
    </div>)
})

export default Landing