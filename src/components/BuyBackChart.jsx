import React from 'react'
import { CummulativeItem } from './Cummulative/CummulativeWrapper'
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material'

const CustomTooltip = ({ active, payload, scale }) => {
    if (!active || !payload )    return null
    for (const bar of payload)
        return <Box fontSize="12px" color="black" bgcolor={'whitesmoke'} borderRadius="5px" p="10px">
            <h3>{ bar.payload?.date }</h3>
            <br/>
            <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center"><Box bgcolor={payload[0].stroke} width="10px" height="10px" mr="5px" />Cummulative Amount { (bar.payload?.amount + payload[0].payload.delta).toFixed(2) }</Box>
            </Box>
        </Box>
    return null
}

const BuyBackChart = ({title, color, fillColor, position, data}) => {
    return <CummulativeItem className={position} title={title}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        bottom: 40,
                        left: 5,
                        right: 10,
                        top: 10
                    }}
                >
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="stepBefore" dataKey="amount" stroke={color} fill={fillColor} dot={{r: 1}} strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>                            
            </ResponsiveContainer>
        </CummulativeItem>
}
//36ac52 36ac52c0, fa4251 fa4251a7
export default BuyBackChart;