

// import styled from '@emotion/styled';
import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';

function Link({ children, href, className }: PropsWithChildren & { href?: string, className?: string }) {
    return <a href={href} className={className}>{children}</a>
}
export const Link3 = styled(Link)(({ theme }) => {
    return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    }
})


