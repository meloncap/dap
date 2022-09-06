import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Title from "../components/Title";
import _ from "lodash";
import { numberWithCommas } from "../utils/calculation";
import CummulativeWrapper from "../components/Cummulative/CummulativeWrapper";
import { CustomInput } from "../components/Stake/CreateStake";
import { Button, styled, Box, NativeSelect } from "@mui/material";
import useAuth from "../hooks/useAuth";
import {
  getMintStatistic,
  canTransfer,
  transferNFT,
  getExchangeTokenAmount,
  swap,
  aggrigate,
  getTierInfo,
} from "../hooks/useTokenInfo";
import { toast } from "react-toastify";
import { FractionalAddress } from "../utils/constant";
import ChartWraper from "../components/Chart/ChartWraper4Grid";
import CChart from "../components/Chart/CChart";
import LChart from "../components/Chart/LChart";
import AChart from "../components/Chart/AChart";
import TokenLogo from "../assets/images/cheemsx_Icon.png"
import NFTLogo from "../assets/images/nft.png"
import {AiOutlineArrowRight} from 'react-icons/ai';
import FormControl from '@mui/material/FormControl';
import NFTFractionCard, { NFTTypeList } from "../components/Fractional/NFTFractionCard";
import BChart from "../components/Chart/BChart";

const Manage = () => {
  const { account } = useAuth();
  const [flatFee, setFlatFee] = useState(0);
  const [maxRegular, setMaxRegular] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [maxWallet, setMaxWallet] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [currencyToken, setCurrencyToken] = useState("");
  const [fraction, setFraction] = useState(0);
  const [transferAddres, setTransferAddress] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [swapAmount, setSwapAmount] = useState("")
  const [changeToNft, setChangeToNft] = useState(false)
  const [exToken, setExToken] = useState(0)
  const [mode, setMode] = useState(Upgrade)
  const [aggrigateAmount , setAggrigateAmount] = useState()
  const [aggType, setAggType] = useState("")
  const [maxTier0, setMaxTier0] = useState("")
  const [borrowFee, setBorrowFee] = useState(0)
  const [poolFraction, setPoolFraction] = useState(0)
  const [poolXYZ, setPoolXYZ] = useState(0)

  useEffect(() => {
    if (!account) return;
    loadUserInfo();
    // eslint-disable-next-line
  }, [account]);

  const loadUserInfo = async () => {
    const {
      flatFee,
      maxRegular,
      priceList,
      maxWallet,
      userInfo,
      currencyToken,
      fractionlize,
      poolFraction,
      maxTier0,
      borrowFee
    } = await getMintStatistic(account);
    setFlatFee(flatFee / 10 ** 18);
    setMaxRegular(maxRegular);
    setPriceList(priceList);
    setMaxWallet(maxWallet);
    setUserInfo(userInfo.reverse());
    setCurrencyToken(currencyToken);
    setFraction(fractionlize);
    setMaxTier0(maxTier0)
    setBorrowFee(borrowFee)
    setPoolFraction(poolFraction)
    const exchangeTokenBal = await getExchangeTokenAmount(account)
    setExToken(exchangeTokenBal)
    const poolXYZBal = await getExchangeTokenAmount(FractionalAddress)
    setPoolXYZ(poolXYZBal)
  };

  const changeAddress = (e) => {
    setTransferAddress(e.target.value)
  }

  const transfer = async() => {
    if(Number(fraction) < Number(transferAmount)) {
      toast.warning("Insurfficient balance of Fractional tokens",{
        toastId: 'Insu transfer'
      })
      return;
    }
    if(!canTransfer(transferAddres, transferAmount)) {
      toast.warning("The receiver can not take anymore", {
        toastId: 'cant mint'
      })
      return;
    }
    await toast.promise(transferNFT(account, transferAddres, transferAmount),{
      pending: "Transferring Now...",
      success: "Success!",
      error: "Something went wrong!",
    })
    loadUserInfo()
  }

  const exchange = async() => {
    if(Number(fraction) < Number(swapAmount) && !changeToNft) {
      toast.warning("Insurfficient balance of Fractional tokens", {
        tokenId: 'Insur swap fraction'
      })
      return;
    }
    if(exToken < Number(swapAmount) && changeToNft) {
      toast.warning("Insufficient balance of Exchange tokens", {
        tokenId: "insur sawp token"
      })
      return;
    }
    if(poolXYZ < Number(swapAmount) && !changeToNft) {
      toast.warning("Insurfficient pool balance of exchange token", {
        tokenId: 'Insur swap fraction'
      })
      return;
    }
    await toast.promise(swap(swapAmount, changeToNft, flatFee.toString(), account),{
      pending: "Swapping ...",
      success: "Success!",
      error: "Something went wrong!",
    })
    loadUserInfo()
  }

  const _aggrigate = async() => {
    if(Number(fraction) < Number(aggrigateAmount)) {
      toast.warning("Insurfficient balance of Fractional tokens", {
        tokenId: 'Insur swap fraction'
      })
      return;
    }
    const {royaltiFee} = await getTierInfo(1)
    await toast.promise(aggrigate(aggrigateAmount, aggType,account, flatFee.toString(), currencyToken, royaltiFee),{
      pending: "Swapping ...",
      success: "Success!",
      error: "Something went wrong!",
    })
    loadUserInfo()
  }

  return (
    <PageContainer>
      <Title title="Manage NFT" mb="50px" />
      <ChartWraper mb="50px" col={1}>
        <CChart
          className="col1"
          value={numberWithCommas(fraction, 2)}
          title="Your NFT fractional balance"
        />
        <LChart
          className="col2"
          value={numberWithCommas(exToken, 2)}
          title="Your ERC20 token balance"
        />
        <AChart
          className="col3"
          value={numberWithCommas(poolFraction, 2)}
          title="Pool Fraction balance"
        />
        <BChart
          className="col4"
          value={numberWithCommas(poolXYZ, 2)}
          title="Pool ERC20 balance"
        />
      </ChartWraper>
      <CummulativeWrapper
        pt="50px"
        borderTop="1px solid rgba(0,0,0,.1)"
      >
        <Box
          className="left"
          display="flex"
          flexDirection={"column"}
          border="1px solid rgba(0,0,0,.125)"
          bgcolor="white"
          mb="50px"
        >
          <Box
            p="0.75rem 1.25rem"
            bgcolor="rgba(0,0,0,.03)"
            borderBottom="1px solid rgba(0,0,0,.125)"
            fontSize="22px"
          >
            Transfer NFT
          </Box>
          <Box display="flex" p="1.25rem" flexDirection="column">
            <CustomInput
              type="text"
              placeholder="Address"
              value={transferAddres}
              onChange={changeAddress}
              style={{ marginBottom: "20px" }}
            />
            <CustomInput
              type="text"
              placeholder="amount"
              value={transferAmount}
              onChange={(e)=>{setTransferAmount(e.target.value)}}
            />
          </Box>
          <Box display="flex" p="1.25rem" justifyContent={'center'}>
            <Button
              variant="contained"
              color="success"
              onClick={transfer}
            >
              Transfer
            </Button>
          </Box>
        </Box>
        <Box
          className="right"
          display="flex"
          flexDirection={"column"}
          border="1px solid rgba(0,0,0,.125)"
          bgcolor="white"
          mb="50px"
        >
          <Box
            p="0.75rem 1.25rem"
            bgcolor="rgba(0,0,0,.03)"
            borderBottom="1px solid rgba(0,0,0,.125)"
            fontSize="22px"
          >
            Swap fractionalized NFT
          </Box>
          <Box display="flex" p="1.25rem" flexDirection="column" justifyContent="center" alignItems="center">
            <Box display="flex" justifyContent="center" alignItems="center" onClick={()=>{setChangeToNft(!changeToNft)}} mb="20px" style={{cursor: 'pointer'}}>
              <Box component="img" width="30px" height="30px" mr="10px" src={changeToNft ? TokenLogo : NFTLogo} />
              <AiOutlineArrowRight color="#f355d1" />
              <Box component="img" width="30px" height="30px" ml="10px" src={changeToNft ? NFTLogo : TokenLogo} />
            </Box>
            <CustomInput
              type="text"
              placeholder="Amount Of Token"
              value={swapAmount}
              onChange={(e)=>{setSwapAmount(e.target.value)}}
            />
          </Box>
          <Box display="flex" p="1.25rem" justifyContent={'center'}>
            <Button
              variant="contained"
              color="success"
              onClick={exchange}
            >
              Swap
            </Button>
          </Box>
        </Box>
      </CummulativeWrapper>
      <CummulativeWrapper
        pt="50px"
        borderBottom="1px solid rgba(0,0,0,.1)"
      >
        <Box
          className="left"
          display="flex"
          flexDirection={"column"}
          border="1px solid rgba(0,0,0,.125)"
          bgcolor="white"
          mb="50px"
        >
          <Box
            p="0.75rem 1.25rem"
            bgcolor="rgba(0,0,0,.03)"
            borderBottom="1px solid rgba(0,0,0,.125)"
            fontSize="22px"
          >
            Aggrigate NFT
          </Box>
          <Box display="flex" p="1.25rem" justifyContent="space-around"  alignItems="center">
            <CustomInput
              type="text"
              placeholder="Amount Of Token"
              value={aggrigateAmount}
              onChange={(e)=>{setAggrigateAmount(e.target.value); setAggType("");}}
              style={{maxWidth: '200px'}}
            />
            
            <NativeSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={aggType}
                onChange={(e)=>{setAggType(e.target.value)}}
                variant="standard"
            >
              <option value={""} ><em>None</em></option>
              {
                _.map(NFTTypeList, (each, index)=>{
                  if(index === 10) return null;
                  return <option value={index} disabled={maxTier0 / maxRegular[index] > aggrigateAmount}>{each}</option>
                })
              }
            </NativeSelect>
          </Box>
          <Box display="flex" p="1.25rem" justifyContent={'center'}>
            <Button
              variant="contained"
              color="success"
              onClick={_aggrigate}
            >
              Aggrigate
            </Button>
          </Box>
        </Box>
      </CummulativeWrapper>
      <Box component="h5" my="10px" width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Box>Your NFT</Box>
        <Box display="flex" alignItems="center" mr="10px" fontSize="14px">
          <Box px="50px">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <NativeSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={mode}
                onChange={(e)=>{setMode(Number(e.target.value))}}
                variant="outlined"
            >
              <option value={Upgrade}>Upgrade</option>
              <option value={Downgrade}>Downgrade</option>
              <option value={Fractionalize}>Fractionalize</option>
              <option value={UpdateURI}>Update URI</option>
              <option value={Borrow}>Borrow</option>
            </NativeSelect>
          </FormControl>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" height={"auto"} fontSize="14px">
        {_.map(userInfo, (each) => {
          return _.map(each.res, (item, i) => {
            const tokenId = item.toString();
            const uri = each.uriList[i];
            return (
              <ItemContainer key={tokenId}>
                <NFTFractionCard 
                  url={uri} 
                  mode={mode} 
                  tokenId={tokenId} 
                  priceList={priceList} 
                  flatFee={flatFee} 
                  onUpdate={loadUserInfo} 
                  borrowFee={borrowFee}
                  maxTier0={maxTier0}
                  maxRegular={maxRegular}
                  poolFraction={poolFraction}
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
    </PageContainer>
  );
};

export default Manage;

export const ItemContainer = styled(Box)`
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

export const Upgrade = 0;
export const Downgrade = 1;
export const Fractionalize = 2;
export const UpdateURI = 3; 
export const Borrow = 4;
export const Holding = 5;
export const Grace = 6;
export const Extra = 7;
export const View = 8;

export const ModeList = ['Upgrade', 'Downgrade', 'Fractionalize', 'Update URI', 'Borrow', 'Holding Period', 'Grace Period', 'Buy with discount', 'Information']