import { Box, styled } from '@mui/material'
import React from 'react'
import { AiFillDollarCircle } from "react-icons/ai"

const TotalMacketCap = ({value, title, ...props }) => {
    return <Wraper {...props} >
        <Box display={'flex'} flexDirection="column">
            <Box display="flex" alignItems='center' color="white" mb="20px">
              <AiFillDollarCircle />
              <Box component={'h6'} ml="20px">{value}</Box>
            </Box>
            <Box color="white" fontSize="22px" fontWeight={200}>{title}</Box>
        </Box>
    </Wraper>
}

export default TotalMacketCap;

const Wraper = styled(Box)`
    background-image: -webkit-linear-gradient(90deg, #45b649 0%, #dce35b 100%);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 10%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-height: 270px;
`