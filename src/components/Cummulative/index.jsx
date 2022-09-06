import React from 'react'
import CummulativeChart, { CummulativePieChart } from '../Chart/CummulativeChart'
import CummulativeWrapper, { CummulativeItem } from '../Cummulative/CummulativeWrapper'
import { Box, styled, } from '@mui/material'
import useTransaction from '../../hooks/useTransaction'
// import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"

const Cummulative = ({pieData}) => {
    const{totalMarketHistory} = useTransaction()

    return <CummulativeWrapper mt="50px">
        <CummulativeItem className="left" title={"CheemsX Market Cap"}>
            {/* <SubTopbar width="100%" display="flex" justifyContent="space-between" alignItems="flex-end" fontSize="14px" mb="50px">
            <Box display="flex">
                <Box display="flex" alignItems="center" mr="15px">
                    <Box borderRadius="50%" width="10px" height="10px" bgcolor="#00b5e9" mr="10px" />
                    <Box color="#666">Products</Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Box borderRadius="50%" width="10px" height="10px" bgcolor="#00ad5f" mr="10px" />
                    <Box color="#666">Services</Box>
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="center" mr="20px">
                    <Box mb="5px" color="#00ad5f" display="flex" alignItems="center">
                        <AiOutlineArrowUp />
                        <Box ml="5px">25%</Box>
                    </Box>
                    <Box color="#666" >Products</Box>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box mb="5px" color="#fa4251" display="flex" alignItems="center">
                        <AiOutlineArrowDown />
                        <Box ml="5px">25%</Box>
                    </Box>
                    <Box color="#666" >Services</Box>
                </Box>
            </Box>
        </SubTopbar> */}
            <CummulativeChart data={totalMarketHistory} />
        </CummulativeItem>
        <CummulativeItem className="right" title="Chart By %" >
            <PieSubTopbar display="flex" width="100%" height="100%" alignItems="center">
                <Box className="chart" >
                    <CummulativePieChart pieData={pieData} />
                </Box>
                <Box fontSize="16px" className="info">
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" alignItems="center"  mb="20px">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#0088FE" mr="15px" />
                            <Box>Community</Box>
                        </Box>
                        <Box display="flex" alignItems="center" mb="20px">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#8624DB" mr="15px" />
                            <Box>Liquidity</Box>
                        </Box>
                        <Box display="flex" alignItems="center" mb="20px">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#00C49F" mr="15px" />
                            <Box>Lp driver</Box>
                        </Box>
                        <Box display="flex" alignItems="center" mb="20px">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#FFBB28" mr="15px" />
                            <Box>Treasury driver</Box>
                        </Box>
                        <Box display="flex" alignItems="center" mb="20px">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#FF8042" mr="15px" />
                            <Box>Air drop reserve</Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Box borderRadius="50%" width="10px" height="10px" bgcolor="#252525" mr="15px" />
                            <Box>Burnt</Box>
                        </Box>
                    </Box>
                </Box>
            </PieSubTopbar>
        </CummulativeItem>
    </CummulativeWrapper>
}

export default Cummulative;


// const SubTopbar = styled(Box)`
//     width: 100%;
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-end;
//     font-size: 14px;
//     margin-bottom: 50px;
//     @media (max-width: 1360px) {
//         flex-direction: column-reverse;
//         justify-content: center;
//     }
//     @media (max-width: 600px) {
//         flex-direction: column-reverse;
//         justify-content: center;
//     }
// `

export const PieSubTopbar = styled(Box)`
    width: 100%;
    display: flex;
    width: 100%;
    align-items: center;
    .chart{
        width: 60%;
    }
    .info {
        width: 40%
    }
    @media (max-width: 1360px) {
        flex-direction: column;
        justify-content: center;
        .chart{
            width: 100%;
            margin-bottom: 20px;
            height: 50%;
        }
        .info {
            width: 100%;
            height: 50%;
        }
    }

    @media (max-width: 600px) {
        flex-direction: column;
        justify-content: center;
        .chart{
            width: 100%;
            margin-bottom: 20px;
            /* height: 50%; */
        }
        .info {
            width: 100%;
            /* height: 50%; */
        }
    }
`
