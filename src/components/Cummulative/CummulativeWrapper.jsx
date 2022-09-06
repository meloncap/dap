import React from 'react'
import { Box, styled } from '@mui/material'

const CummulativeWrapper = ({children, ...props}) => {
    return  <Wrapper {...props}>
    {children}
</Wrapper>
}

export default CummulativeWrapper;

const Wrapper = styled(Box)`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 50px;
    grid-row-gap: 0px;

    .left { grid-area: 1 / 1 / 2 / 2; }
    .right { grid-area: 1 / 2 / 2 / 3; }

    @media (max-width: 600px) {
        display: flex;
        flex-direction: column;
        .left{
            margin-bottom: 50px;
        }
    }
`
export const CummulativeItem = ({children, title, ...props}) => {
    return  <CummulativeItemWraper {...props}>
        <Box color="#333333" fontSize="24px" fontWeight="400" mb="30px">{title}</Box>
    {children}
</CummulativeItemWraper>
}

const CummulativeItemWraper = styled(Box)`
    padding: 40px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 10%);
    border-radius: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
`