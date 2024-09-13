

import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

export function Link1({ children, href, className }: PropsWithChildren & { href?: string, className?: string }) {
    return <a href={href} className={className}>{children}</a>
}

export const Link2 = styled(Link1)({
    backgroundColor: 'red'
})


