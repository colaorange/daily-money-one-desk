import '@/App.css';
import dmoLogo from '@/assets/dmo.png';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import useApi from '@/contexts/useApi';
import { useI18nLabel } from '@/contexts/useI18n';
import utilStyles from '@/utilStyles';
import { BasicApi } from '@client/api';
import { Configuration } from '@client/configuration';
import { Fail } from '@client/model';
import { css, keyframes } from '@emotion/react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import Stack from '@mui/material/Stack';
import { AxiosError } from 'axios';
import { memo, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import useTheme from './contexts/useTheme';
import { AdsLevel } from './types';

export type LandingProps = PropsWithChildren

export const Landing = memo(function Landing(props: LandingProps) {

    const {theme} = useTheme()
    const { basePath, custom, publicSetting, setAuhtorization } = useApi()
    const ll = useI18nLabel()

    const [tokenVisible, setTokenVisible] = useState<boolean>()
    const [connectionToken, setConnectionToken] = useState('')
    const [authResult, setAuthResult] = useState<{
        error?: boolean,
        message?: string
    }>()

    const onToggleTokenVisible = useCallback(() => {
        setTokenVisible((tv) => !tv)
    }, [])

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
                const authedApi = new BasicApi(new Configuration({
                    basePath,
                    apiKey: connectionToken
                }))

                const preferences = (await authedApi.getPreference()).data

                setAuhtorization({
                    connectionToken,
                    preferences
                })

                if (!publicSetting.adsLevel || (publicSetting.adsLevel < AdsLevel.NONE)) {
                    authedApi.watchAds().catch(() => { })//eat
                }

            } else {
                setAuthResult({
                    error: true,
                    message: ll('desktop.wrongConnectionToken')
                })
            }
        } catch (err) {
            doError(err)
        }
    }, [basePath, connectionToken, doError, ll, setAuhtorization, publicSetting])

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
                type={tokenVisible ? 'text' : 'password'}
                autoComplete='password'
                value={connectionToken} onChange={(evt) => {
                    setConnectionToken(evt.target.value)
                    setAuthResult({})
                }}
                error={!!authResult?.error}
                helperText={authResult?.message}
                slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                onClick={onToggleTokenVisible}
                                edge="end"
                            >
                                {tokenVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                }}
            />
            <Button variant="contained" onClick={doAuth}>
                {ll('action.authorize')}
            </Button>
            {(!publicSetting.adsLevel || publicSetting.adsLevel < AdsLevel.NONE) &&
                <Stack direction='row' alignItems='center' justifyContent='center' gap={theme.spacing(1)}>
                    <SmartDisplayIcon />
                    <Typography>{ll('desktop.playAdsInfo')}</Typography>
                </Stack>}
        </form>
    </Paper >)
})

export default Landing