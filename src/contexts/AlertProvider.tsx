
import { PropsWithChildren, ReactNode, createContext, memo, useCallback, useMemo } from "react";

import { hint } from "@/utils";
import Typography from '@mui/material/Typography';
import { SnackbarProvider, useSnackbar } from 'notistack';

export type AlertProviderProps = PropsWithChildren

export type AlertContextValue = {
    push(alert: Alert): void
}

// eslint-disable-next-line react-refresh/only-export-components
export enum AlertLevel {
    NORMAL,
    WARN,
    ERROR
}

export type Alert = {
    message: string
    level?: AlertLevel
    duration?: number
    action?: AlertAction
}

export type AlertAction = {
    label?: string
    onClick?: () => void
    node?: ReactNode
}


export const AlertContext = createContext<AlertContextValue | undefined>(undefined)

export const AlertProvider = memo(function AlertProvider({ children }: AlertProviderProps) {
    return <SnackbarProvider maxSnack={5}>
        <AlertProvider0>
            {children}
        </AlertProvider0>
    </SnackbarProvider>
})

export const AlertProvider0 = memo(function AlertProvider({ children }: AlertProviderProps) {

    const { enqueueSnackbar } = useSnackbar();

    const push = useCallback((alert: Alert) => {
        const { message, action, duration, level = AlertLevel.NORMAL } = alert
        enqueueSnackbar(message, {
            variant: level === AlertLevel.NORMAL ? 'default' : ((level === AlertLevel.WARN) ? 'warning' : 'error'),
            autoHideDuration: duration,
            action: action && (action.node || <Typography variant="body1" onClick={action.onClick} />)
        });
    }, [enqueueSnackbar])


    const value = useMemo(() => {
        return hint<AlertContextValue>({ push })
    }, [push])

    return <AlertContext.Provider value={value} >
        {children}
    </AlertContext.Provider>
})

export default AlertProvider
