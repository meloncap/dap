import React from 'react'
import { ResponsiveContainer, AreaChart, Tooltip, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { Box, } from '@mui/material'
import { numberWithCommas } from '../../utils/calculation';


// const Piedata = [
//   { name: 'Community', value: 400 },
//   { name: 'Total Airdrop', value: 300 },
//   { name: 'Lp Driver', value: 300 },
//   { name: 'Treasury Driver', value: 200 },
//   { name: 'Airdrop Driver', value: 200 },
//   { name: 'Airdrop Driver', value: 200 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8624DB'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload) return null
  for (const bar of payload)
    return <Box fontSize="12px" color="black" bgcolor={'whitesmoke'} borderRadius="5px" p="10px">
      <h3>{bar.payload.name}</h3>
      <br />
      ${numberWithCommas(bar.value, 2)}
    </Box>
  return null
}

const CummulativeChart = ({data}) => {
  return <ResponsiveContainer height={200} >
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="service" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00ad5f" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#00ad5f" stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <XAxis dataKey="name" style={{ fontSize: '12px' }} />
      <YAxis style={{ fontSize: '12px' }} />
      <CartesianGrid strokeDasharray="0 0" stroke="#757575" strokeWidth={0.2} />
      <Tooltip content={<CustomTooltip/>} />
      <Area type="monotone" dataKey="pv" stroke="#00ad5f" fillOpacity={1} fill="url(#service)" />
    </AreaChart>
  </ResponsiveContainer>
}

export default CummulativeChart;

const CustomTooltipForPie = ({ active, payload }) => {
  if (!active || !payload) return null
  for (const bar of payload)
    return <Box fontSize="12px" color="black" bgcolor={'whitesmoke'} borderRadius="5px" p="10px">
      <h3>{bar.payload.name}</h3>
      <br />
      {numberWithCommas(bar.value, 2)}% 
    </Box>
  return null
}

export const CummulativePieChart = ({pieData}) => {
  return <ResponsiveContainer width="100%"  height={170}>
  <PieChart width="100%">
    <Pie dataKey="value" data={pieData} cx={'50%'} cy={'50%'} innerRadius={40} outerRadius={80} fill="#82ca9d">
      {pieData?.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip content={<CustomTooltipForPie/>} />
  </PieChart>
</ResponsiveContainer>
}