import { appErrMessage } from "@/appUtils"
import { AlertLevel } from "@/contexts/AlertProvider"
import useAlert from "@/contexts/userAlert"
import { PropsWithChildren, useCallback, useEffect } from "react"


//TODO weakref
let lastUnhandledError: any

export function UnhandledErrorBoundary({ children }: PropsWithChildren) {
    const alert = useAlert()

    const onUnhandledError = useCallback((evt: ErrorEvent) => {
        const { error } = evt
        if (lastUnhandledError !== error) {
            lastUnhandledError = error
            alert.push({
                message: `Error : ${appErrMessage(error).message}`,
                level: AlertLevel.ERROR
            })
        }
    }, [alert])
    const onUnhandledRejection = useCallback((evt: PromiseRejectionEvent) => {
        const { reason } = evt
        if (lastUnhandledError !== reason) {
            lastUnhandledError = reason
            alert.push({
                message: `Promise Rejection : ${appErrMessage(reason).message}`,
                level: AlertLevel.ERROR
            })
        }
    }, [alert])

    useEffect(() => {
        window.addEventListener('error', onUnhandledError)
        window.addEventListener('unhandledrejection', onUnhandledRejection)
        return () => {
            window.removeEventListener('error', onUnhandledError)
            window.removeEventListener('unhandledrejection', onUnhandledRejection)
        }
    }, [onUnhandledError, onUnhandledRejection])

    return children
}


export default UnhandledErrorBoundary