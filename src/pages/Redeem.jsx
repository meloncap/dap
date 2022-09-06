import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Title from "../components/Title";
import _ from "lodash";
import { numberWithCommas } from "../utils/calculation";
import { styled, Box } from "@mui/material";
import NativeSelect from '@mui/material/NativeSelect';
import useAuth from "../hooks/useAuth";
import {
  getMintStatistic,
  borrowInfo,
} from "../hooks/useTokenInfo";
import ChartWraper from "../components/Chart/ChartWraper4Grid";
import CChart from "../components/Chart/CChart";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NFTFractionCard from "../components/Fractional/NFTFractionCard";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Holding, Grace, Extra } from "./Manage";

const Redeem = () => {
  const { account } = useAuth();
  const [flatFee, setFlatFee] = useState(0);
  const [maxRegular, setMaxRegular] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [maxWallet, setMaxWallet] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [fraction, setFraction] = useState(0);
  const [maxTier0, setMaxTier0] = useState("")
  const [mode, setMode] = useState(Holding)
  const [borrowFee, setBorrowFee] = useState()
  const [redeemFee, setRedeemFee] = useState()
  const [graceFee, setGraceFee] = useState()
  const [discountFee, setDiscountFee] = useState()
  const [holdPeriod, setHoldPeriod] = useState()
  const [gracePeriod, setGracePeriod] = useState()
  const [borrowList, setBorrowList] = useState([])

  useEffect(() => {
    if (!account) return;
    loadUserInfo();
    // eslint-disable-next-line
  }, [account]);

  useEffect(()=>{
    loadBorrowInfo()
    // eslint-disable-next-line
  },[])

  const loadBorrowInfo = async() => {
    
    const {borrowFee, redeemFee, graceFee, discountFee, holdPeriod, gracePeriod, getBorrowInfo} = await borrowInfo()
    setBorrowFee(borrowFee)
    setRedeemFee(redeemFee)
    setGraceFee(graceFee)
    setDiscountFee(discountFee)
    setHoldPeriod(holdPeriod)
    setGracePeriod(gracePeriod)
    setBorrowList(getBorrowInfo.borrowInfoList)
    console.log(borrowFee, redeemFee, graceFee, discountFee, holdPeriod, gracePeriod, getBorrowInfo)
  }

  const loadUserInfo = async () => {
    const {
      flatFee,
      maxRegular,
      priceList,
      maxWallet,
      userInfo,
      fractionlize,
      maxTier0
    } = await getMintStatistic(account);
    setFlatFee(flatFee / 10 ** 18);
    setMaxRegular(maxRegular);
    setPriceList(priceList);
    setMaxWallet(maxWallet);
    setUserInfo(userInfo.reverse());
    setFraction(fractionlize);
    setMaxTier0(maxTier0)    
  };

  return (
    <PageContainer>
      <Title title="Redeem NFT" mb="50px" />
      <ChartWraper mb="50px" col={1}>
        <CChart
          className="col1"
          value={numberWithCommas(fraction, 2)}
          title="Your NFT fractional balance"
        />
      </ChartWraper>
      <Box mb="50px">
        <EnhancedTable rows={[holdPeriod, gracePeriod, borrowFee, discountFee, redeemFee, graceFee]} />
      </Box>
      <Box component="h5" my="10px" width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Box>Borrowed NFT</Box>
        <Box display="flex" alignItems="center" mr="10px" fontSize="14px">
          <Box px="50px">
          <FormControl sx={{ m: 1, minWidth: 120 }}  variant="standard">
          <InputLabel id="demo-customized-select-native">Mode</InputLabel>
            <NativeSelect
                labelId="demo-customized-select-native"
                id="demo-simple-select-standard"
                value={mode}
                onChange={(e)=>{setMode(Number(e.target.value))}}
                label="Mode"
                MenuProps={{ disableScrollLock: false }}
            >
              <option value={Holding}>Holding</option>
              <option value={Grace}>Grace Period</option>
              <option value={Extra}>Buy with discount</option>
            </NativeSelect>
          </FormControl>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" height={"auto"} fontSize="14px">
        {_.map(borrowList, (each, i) => {
          if((mode === Holding || mode === Grace) && each.user !== account) return null;
          if(mode === Extra && each.user === account) return null;
          const tokenId = each.nftId.toString();
          const borrowTime = each.borrowTime.toNumber()
          let deltatime = new Date();
          deltatime = deltatime / 1000 - borrowTime
          if(mode === Holding && deltatime > holdPeriod) return null;
          else if(mode === Grace && (deltatime > holdPeriod + gracePeriod || deltatime < holdPeriod)) return null;
          else if(mode === Extra && deltatime < holdPeriod + gracePeriod) return null;
          return <ItemContainer key={tokenId}>
            <NFTFractionCard 
              mode={mode} 
              tokenId={tokenId} 
              priceList={priceList} 
              flatFee={flatFee} 
              onUpdate={loadUserInfo} 
              borrowTime={borrowTime} 
              maxRegular={maxRegular} 
              redeemFee={redeemFee}
              maxTier0={maxTier0}
              borrowFee={borrowFee}
              holdPeriod={holdPeriod}
              gracePeriod={gracePeriod}
              discountFee={discountFee}
              graceFee={graceFee}
              balance={fraction}
              userInfo={userInfo}
              maxWallet={maxWallet}
            />
          </ItemContainer>
        })}
        <ItemContainer height={0} minHeight={"unset"} />
        <ItemContainer height={0} minHeight={"unset"} />
      </Box>
    </PageContainer>
  );
};

export default Redeem;

const ItemContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30%;
  flex: 1;
  @media (max-width: 1028px) {
    min-width: 40%;
  }
  @media (max-width: 720px) {
    min-width: 90%;
  }
`;
ItemContainer.defaultProps = {
  minHeight: "400px",
};

const headCells = [
  {
    id: "terms",
    numeric: true,
    disablePadding: false,
    label: "Terms",
  },
  {
    id: "value",
    numeric: true,
    disablePadding: false,
    label: "Value",
  },
  {
    id: "explanation",
    numeric: true,
    disablePadding: true,
    label: "Explanation",
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
          Borrow
        </Typography>
    </Toolbar>
  );
};

function EnhancedTable({rows}) {
  const [_rows, setRows] = useState([30,10,60,10,10,10])
  useEffect(()=>{
    if(!rows || rows.length !== 6) return;
    setRows(rows)
  }, [rows])
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
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">Hold Time</TableCell>
                <TableCell align="center" style={{width: '100px'}}>{_rows[0]} sec</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>Borrower can borrow Fractional NFT using their NFT as a collateral with a default duration of {_rows[0]} days. Borrower remains the NFT woner for the duration. The factional NFT can be swapped to ERC20 or used to mint more NFT (to sell in secondary market) and borrower can repay and take their NFT back</TableCell>
              </TableRow>
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">Grace Time</TableCell>
                <TableCell align="center">{_rows[1]} sec</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>If borrower failed to reedem their NFT in their agreed upon {_rows[1]} days, an addtional 10 day will be the grace period, during which there will be a additional fee to redeem</TableCell>
              </TableRow>
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">Maximum amount you can borrow</TableCell>
                <TableCell align="center">{_rows[2]} %</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>{_rows[2]}% NFT value user can borrow in NFT fraction denominations.</TableCell>
              </TableRow>
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">Discount for Other User<br/>[after grace perod]</TableCell>
                <TableCell align="center">{_rows[3]} %</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>If original NFT owner failed to redeem after hold time and grace period is over then other user can claim the original NFT with {_rows[3]}% discount</TableCell>
              </TableRow>
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">RedeemFee</TableCell>
                <TableCell align="center">{_rows[4]} %</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>When the original user redeem there NFT there is {_rows[4]}% fee</TableCell>
              </TableRow>
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
              >
                <TableCell align="center">GraceFee</TableCell>
                <TableCell align="center">{_rows[5]} %</TableCell>
                <TableCell align="center" style={{width: '70%', textAlign: 'left'}}>If the original NFT user tries to redeem during the grace period there is additional {_rows[5]}% fee</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}