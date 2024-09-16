// import { css } from '@emotion/css'
import { css } from '@emotion/react'

/**
 * utility styles
 */
export const utilStyles = {
    fill: css({
        display: 'flex',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    }),
    hlayout: css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }),
    hclayout: css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    helayout: css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }),
    vlayout: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }),
    vclayout: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    velayout: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
    }),
    flex0: css({
        display: 'flex',
        flex: 0
    }),
    flex1: css({
        display: 'flex',
        flex: 1
    })
}

export default utilStyles
