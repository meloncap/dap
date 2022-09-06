import { Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { TiChartLineOutline } from "react-icons/ti";

const data1 = [
  {
    name: "Page A",
    pv: 3,
  },
  {
    name: "Page B",
    pv: 4,
  },
  {
    name: "Page C",
    pv: 9,
  },
  {
    name: "Page D",
    pv: 1,
  },
  {
    name: "Page E",
    pv: 2,
  },
  {
    name: "Page F",
    pv: 5,
  },
  {
    name: "Page G",
    pv: 6,
  },
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload)    return null
    for (const bar of payload)
        return <Box fontSize="12px" color="black" bgcolor={'whitesmoke'} borderRadius="5px" p="10px">
            <h3>{ bar.payload.name }</h3>
            <br/>
            { bar.value }
        </Box>
    return null
}

const CChart = ({ value, title,data,showTooltip, ...props }) => {
  const [_data, setData] = useState([]);
  useEffect(() => {
    if (!data) setData(data1);
    else setData(data);
  }, [data]);
  return (
    <CChartBox {...props}>
      <Box display={"flex"} flexDirection="column">
        <Box display="flex" alignItems="center" color="white" mb="20px">
          <TiChartLineOutline />
          <Box fontWeight="bold" fontSize="20px" ml="20px">
            {value}
          </Box>
        </Box>
        <Box color="white" fontSize="20px" fontWeight={200}>
          {title}
        </Box>
      </Box>
      <ResponsiveContainer height={120}>
        <LineChart
          data={_data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showTooltip && data.length > 0 && <Tooltip content={<CustomTooltip/>} />}
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#dddddd"
            fillOpacity={1}
            strokeWidth={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </CChartBox>
  );
};

export default CChart;

const CChartBox = styled(Box)`
  background-image: -webkit-linear-gradient(90deg, #ee0979 0%, #ff6a00 100%);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 10%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`;
