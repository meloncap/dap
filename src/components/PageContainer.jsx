import { Box, styled } from '@mui/material'

const BlankWraper = styled(Box)`
    padding: 40px;
    font-size: 36px;
    display: flex;
    flex-direction: column;

    @media (max-width: 600px) {
        padding: 20px;
        font-size: 24px;
    }
`

export default BlankWraper