import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Title from "../components/Title";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { ExpToNumber } from "../utils/calculation";
import { Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import {
  getMintStatistic,
  getTokenName,
} from "../hooks/useTokenInfo";
import MintModal from "../components/MintModal";
import { AVAX } from "../utils/constant";
import AChart from "../components/Chart/AChart";
import BChart from "../components/Chart/BChart";
import CChart from "../components/Chart/CChart";
import ChartWraper from "../components/Chart/ChartWraper4Grid";
import LChart from "../components/Chart/LChart";
import { ItemContainer, View } from "./Manage";
import NFTFractionCard from "../components/Fractional/NFTFractionCard";
import _ from 'lodash'

const Minting = () => {
  const { account } = useAuth();
  const [flatFee, setFlatFee] = useState(0)
  const [maxRegular, setMaxRegular] = useState([])
  const [priceList, setPriceList] = useState([])
  const [maxWallet, setMaxWallet] = useState([])
  const [currencyToken, setCurrencyToken] = useState("")
  const [rows, setRow] = useState([{},{},{},{},{},{},{},{},{},{}])
  const [tBalance, setTBalance] = useState([])
  const [open, setOpen] = useState(false)
  const [symbol, setSymbol] = useState("")
  const [userInfo, setUserInfo] = useState([])
  const [maxChart, setMaxCharts] = useState([])
  const [remainChart, setRemainCharts] = useState([])
  const [costChart, setCostCharts] = useState([])
  const [maxPerWalletChart, setMaxPerWalletCharts] = useState([])
  const [myMint, setMyMint] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [limit, setLimit] = useState(0)
  let navigate = useNavigate();

  useEffect(() => {
    if (!account) return;
    loadUserInfo();
    // eslint-disable-next-line
  }, [account]);

  const loadUserInfo = async () => {
    const {flatFee, maxRegular, priceList, maxWallet, userInfo, currencyToken, tBalance} = await getMintStatistic(account);
    setFlatFee(flatFee / 10**18)
    setMaxRegular(maxRegular)
    setPriceList(priceList)
    setMaxWallet(maxWallet)
    setUserInfo(userInfo)
    setCurrencyToken(currencyToken)
    setTBalance(tBalance)
    let symbol;
    if(currencyToken.toLowerCase() === AVAX.toLowerCase())
      symbol = "AVAX"
    else
      symbol = await getTokenName(currencyToken)
    setSymbol(symbol)
    const row = [], _maxChart = [], _remainChart = [], _costChart = [], _maxPerWalletChart = [];
    let _myMint = 0, _remaining = 0, _limit = 0; 
    for (let i = 0; i < 10; i++) {
      let remain = maxRegular[i] - tBalance[i];
      _remaining += remain;
      _limit += maxWallet[i];
      row.push({type: `Tier${i+1}`, max: maxRegular[i], status: 'TBA', remain: remain, cost: `${ExpToNumber(priceList[i])} ${symbol}`})
      
      _remainChart.push({name: `Tier${i+1}`, pv: remain})
      _costChart.push({name: `Tier${i+1}`, pv: priceList[i]})
      _maxPerWalletChart.push({name: `Tier${i+1}`, pv: maxWallet[i]})
    }
    for(let i = 0; i < 10; i++) {
      _maxChart.push({name: `Tier${i+1}`, pv: userInfo[i]?.res.length})
      _myMint += userInfo[i]?.res.length;
    }
    setMyMint(_myMint)
    setRemaining(_remaining)
    setLimit(_limit)
    setMaxCharts(_maxChart)
    setRemainCharts(_remainChart)
    setCostCharts(_costChart)
    setMaxPerWalletCharts(_maxPerWalletChart)
    setRow(row)
  };

  const openModal = () => {
    if(!account) return;
    setOpen(true)
  }

  return (
    <PageContainer>
      <Title title="Mint NFT" mb="50px" />
      <ChartWraper mb="50px">
        <AChart
          className="col1"
          value={myMint}
          title="Your Minted NFT"
          data={maxChart}
          showTooltip
        />
        <CChart
          className="col2"
          value={remaining}
          title="Remaining Mints"
          data={remainChart}
          showTooltip
        />
        <LChart
          className="col3"
          value={limit}
          title="Your Wallet Limit"
          data={maxPerWalletChart}
          showTooltip
        />
        <BChart
          className="col4"
          value={costChart[0]?.pv}
          title="Minimum Mint Cost"
          data={costChart}
          showTooltip
        />
      </ChartWraper>
      <Box textAlign="center" mb="50px">
        <Button variant="contained" color="warning" size="large" onClick={openModal}>Mint Now</Button>
      </Box>
      <Box component="h5" my="10px" width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Box>Your NFT</Box>
        <Box display="flex" alignItems="center" mr="10px" fontSize="14px">
          <Box px="50px">
            <Button sx={{textTransform: 'none'}} variant="outlined" color="secondary" onClick={()=>{navigate("/manage")}}>Manage NFTs</Button>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" height={"auto"} fontSize="14px" mb="50px">
        {_.map(userInfo, (each) => {
          return _.map(each.res, (item, i) => {
            const tokenId = item.toString();
            const uri = each.uriList[i];
            return (
              <ItemContainer key={tokenId}>
                <NFTFractionCard 
                  url={uri} 
                  mode={View} 
                  tokenId={tokenId} 
                  priceList={priceList} 
                  flatFee={flatFee} 
                  onUpdate={loadUserInfo} 
                  maxRegular={maxRegular}
                  maxWallet={maxWallet}
                  userInfo={userInfo}
                />
              </ItemContainer>
            );
          });
        })}
        <ItemContainer height={0} minHeight={"unset"} />
        <ItemContainer height={0} minHeight={"unset"} />
      </Box>
      {userInfo.length === 0 && <Box width="100%" textAlign='center' fontWeigh="bold" fontSize="20px" p='20px' mb="50px"><em>No NFT</em></Box>}
      <Box mb="50px">
        <EnhancedTable rows={rows} />
      </Box>
      <MintModal 
        isOpen={open}
        onClose={()=>{setOpen(false)}}
        maxRegular={maxRegular}
        tBalance={tBalance}
        currencyToken={currencyToken}
        flatFee={flatFee}
        priceList={priceList}
        maxWallet={maxWallet}
        symbol={symbol}
        onMint={loadUserInfo}
        userInfo={userInfo}
      />
    </PageContainer>
  );
};

export default Minting;

const headCells = [
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "max",
    numeric: true,
    disablePadding: false,
    label: "Max Mint",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: true,
    label: "Mint Status",
  },
  {
    id: "remain",
    numeric: true,
    disablePadding: false,
    label: "Remaining to mint",
  },
  {
    id: "cost",
    numeric: true,
    disablePadding: false,
    label: "Current Minting Cost",
  },
];

function EnhancedTableHead() {

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
              {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = () => {

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: "#333",
        color: "white",
      }}
    >
     <Typography
          sx={{ flex: "1 1 100%", textAlign: 'center' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Mint Statistics
        </Typography>
    </Toolbar>
  );
};

function EnhancedTable({rows}) {

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{ width: "100%", mb: 2, borderRadius: "8px", overflow: "hidden" }}
      >
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{ minWidth: 850 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead />
            <TableBody>
              {rows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.type}
                    >
                      <TableCell
                        id={labelId}
                        align="center"
                      >
                        {row.type}
                      </TableCell>
                      <TableCell align="center">{row.max}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">{row.remain}</TableCell>
                      <TableCell align="center">{row.cost}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
