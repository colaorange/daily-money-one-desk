import '@/App.css'
import dmoLogo from '@/assets/dmo.png'
import reactLogo from '@/assets/react.svg'
import viteLogo from '@/assets/vite.svg'
import useApi from '@/contexts/useApi'
import { useI18nLabel } from '@/contexts/useI18n'
import utilStyles from '@/utilStyles'
import { BasicApi } from '@client/api'
import { Configuration } from '@client/configuration'
import { Fail } from '@client/model'
import { css, keyframes } from '@emotion/react'
import { Paper, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { AxiosError } from 'axios'
import { memo, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type LandingProps = PropsWithChildren

export const Landing = memo(function Landing(props: LandingProps) {
    const { basePath, custom, setAuhtorization } = useApi()
    const ll = useI18nLabel()

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

    const doAuth = useCallback(async () => {
        const api = new BasicApi(new Configuration({
            basePath,
        }))
        try {
            const result = (await api.authorize(connectionToken)).data
            if (!result.error) {
                const preferences = (await new BasicApi(new Configuration({
                    basePath,
                    apiKey: connectionToken
                })).getPreference()).data

                setAuhtorization({
                    connectionToken,
                    preferences
                })
            } else {
                setAuthResult({
                    error: true,
                    message: ll('desktop.wrongConnectionToken')
                })
            }
        } catch (err) {
            doError(err)
        }
    }, [basePath, connectionToken, doError, ll, setAuhtorization])

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
            root: css(utilStyles.vlayout, {
                paddingTop: 80,
                minHeight: '100vh'
            }),
            powerBy: css({
                position: 'absolute',
                right: 8,
                top: 8,
                overflow: 'hidden',
                '.logo': css({
                    height: '3em',
                    padding: '0.5em',
                }),
                '.react': css({
                    animation: `${logoSpin} infinite 10s linear`,
                }),
            }),
            dmo: css({
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                'img': {
                    width: 200
                }
            }),
            form: css({
                padding: '2em',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                width: `min(100vw, 500px)`
            })
        }
    }, [])

    return (<Paper css={styles.root}>
        <div css={styles.powerBy}>
            <img src={viteLogo} className='logo' alt="Vite logo" />
            <img src={reactLogo} className='logo react' alt="React logo" />
        </div>
        <Typography variant='h3'>{ll('appName')}</Typography>
        <Typography variant='h3'>{ll('desktop')}</Typography>
        <form css={styles.form} onSubmit={(evt) => {
            evt.preventDefault()
            doAuth()
        }}>
            <div css={styles.dmo} >
                <img src={dmoLogo} alt="Daily Money One logo" />
            </div>
            {custom && <Typography align='center'>{ll('desktop.apiBasePath')} : {basePath}</Typography>}
            <TextField
                label={ll('serverMode.connectionToken')}
                variant='outlined'
                type='password'
                autoComplete='password'
                value={connectionToken} onChange={(evt) => {
                    setConnectionToken(evt.target.value)
                    setAuthResult({})
                }}
                error={!!authResult?.error}
                helperText={authResult?.message}
            />
            <Button variant="contained" onClick={doAuth}>
                {ll('action.authorize')}
            </Button>
        </form>
    </Paper>)
})

export default Landing