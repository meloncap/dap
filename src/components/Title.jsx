import { Box, styled } from '@mui/material'
import React from 'react'

const Title = ({title, ...props}) => {
    return <TitleWraper {...props}>
        <h4>{title}</h4>
    </TitleWraper>
}

export default Title;

const TitleWraper = styled(Box)`
    padding: 0.75rem 1.25rem;
    background-color: rgba(0,0,0,.03);
    border-bottom: 1px solid rgba(0,0,0,.125);
    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
    h4 {
        color: #333333;
    }
`