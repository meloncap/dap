import { Box, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts"
import { TiChartArea } from "react-icons/ti";

const data1 = [
    {
      "name": "Page A",
      "pv": 1,
    },
    {
      "name": "Page B",
      "pv": 2,
    },
    {
      "name": "Page C",
      "pv": 5,
    },
    {
      "name": "Page D",
      "pv": 7,
    },
    {
      "name": "Page E",
      "pv": 9,
    },
    {
      "name": "Page F",
      "pv": 2,
    },
    {
      "name": "Page G",
      "pv": 11,
    }
  ]

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload )    return null
    for (const bar of payload)
        return <Box fontSize="12px" color="black" bgcolor={'whitesmoke'} borderRadius="5px" p="10px">
            <h3>{ bar.payload.name }</h3>
            <br/>
            { bar.value }
        </Box>
    return null
}

const AChart = ({value, title,data,showTooltip, ...props }) => {
    const [_data, setData] = useState([])
    useEffect(()=>{
      if(!data) setData(data1)
      else setData(data)
    },[data])
    return <AChartBox {...props}>
        <Box display={'flex'} flexDirection="column">
          <Box display="flex" alignItems="center" color="white" mb="20px">
            <TiChartArea />
            <Box fontWeight="bold" fontSize="20px" ml="20px">
              {value}
            </Box>
          </Box>
            <Box color="white" fontSize="20px" fontWeight={200}>{title}</Box>
        </Box>
        <ResponsiveContainer height={120}>
            <AreaChart data={_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dddddd" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#dddddd" stopOpacity={0.3}/>
                    </linearGradient>
                </defs>
                {showTooltip && data.length > 0 && <Tooltip content={<CustomTooltip/>} />}
                <Area type="monotone" dataKey="pv" stroke="#dddddd" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
            </AreaChart>
        </ResponsiveContainer>
    </AChartBox>
}

export default AChart;

const AChartBox = styled(Box)`
    background-image: -webkit-linear-gradient(90deg, #3f5efb 0%, #fc466b 100%);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 10%);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`