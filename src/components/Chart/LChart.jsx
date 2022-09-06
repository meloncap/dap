import { Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { GiChart } from "react-icons/gi";

const data1 = [
  {
    name: "Page A",
    pv: 2400,
  },
  {
    name: "Page B",
    pv: 1398,
  },
  {
    name: "Page C",
    pv: 9800,
  },
  {
    name: "Page D",
    pv: 3908,
  },
  {
    name: "Page E",
    pv: 4800,
  },
  {
    name: "Page F",
    pv: 3800,
  },
  {
    name: "Page G",
    pv: 4300,
  },
];

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

const LChart = ({ value, title,data,showTooltip, ...props }) => {
  const [_data, setData] = useState([]);
  useEffect(() => {
    if (!data) setData(data1);
    else setData(data);
  }, [data]);
  return (
    <LChartBox {...props}>
      <Box display={"flex"} flexDirection="column">
        <Box display="flex" alignItems="center" color="white" mb="20px">
          <GiChart />
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
          height={120}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* <Legend /> */}
        { showTooltip && data.length > 0 && <Tooltip content={<CustomTooltip/>} />}
          <Line
            type="linear"
            dataKey="pv"
            stroke="#dddddd"
            fillOpacity={1}
            strokeWidth={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </LChartBox>
  );
};

export default LChart;

const LChartBox = styled(Box)`
  background-image: -webkit-linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 10%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`;
