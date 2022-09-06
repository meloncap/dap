import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button } from '@mui/material';
import { ExpToNumber } from '../utils/calculation';
import { canMint, getDefaultURL, mint } from '../hooks/useTokenInfo';
import styled from 'styled-components';
import { AVAX } from '../utils/constant';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

export default function MintModal({isOpen, onClose, maxRegular, tBalance, currencyToken, flatFee, priceList, onMint, symbol, maxWallet, userInfo}) {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState(0)
  const [url, setUrl] = useState("")
  const [amount, setAmount] = useState(1)
  const {account} = useAuth()

  useEffect(()=>{
      setOpen(isOpen);
  },[isOpen])

  useEffect(()=>{
    (async()=>{
        const uri = await getDefaultURL(tier)
        const {data} = await axios.get(uri);
        setUrl(data.image)
    })()
  },[tier])

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const onChange = (e) => {
    if(Number(e.target.value) > 10) setAmount(10)
    else if (Number(e.target.value) < 1) setAmount(1)
    else setAmount(Number(e.target.value))
  }

  const decrease = () => {
    setAmount(amount-1 < 1 ? 1 : amount -1)
  }

  const increase = () => {
    setAmount(amount+1 > 10 ? 10 : amount + 1)
  }

  const _mint = async() => {
    if(maxWallet[tier] < amount + userInfo[tier]?.res.length) {
        toast.warn("Cannot mint anymore. Your wallet is up to limit")
        return
    }
    const _canMint = await canMint(tier, amount, priceList[tier], flatFee, account)
    if(_canMint.limitMint) {
        toast.warn("Cannot mint anymore")
        return
    }
    if(_canMint.insufficient) {
        toast.warn("Insufficience balance")
        return
    }
    let value = flatFee;
    if(currencyToken.toLowerCase() === AVAX.toLowerCase()) {
        value += priceList[tier] * amount;
    }

    value = value.toFixed(10)
    console.log(value)
    await toast.promise(mint(account, tier, amount, value, currencyToken),
        {
            pending: 'Minting Now...',
            success: 'You have minted',
            error: 'Something went wrong!'
        }
    )
    onMint();
  }
  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
            style: {
                transition: 'all 0.3s ease-in',
                transform: 'scale(1)',
                width: '440px'
            },
        }}
      >
        <Box display="flex" flexDirection="column" justifyContent="center" p="40px" alignItems="center" fontSize="12px">
            <Box component="h2" textAlign={'center'}>COLLECT YOUR NFT <br/> BEFORE END</Box>
            <Box component="img" src={url} width="200px" height="200px" my="30px" />
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={tier}
                onChange={(e)=>{setTier(e.target.value)}}
                variant="standard"
            >
                <MenuItem value={0}>Tier1</MenuItem>
                <MenuItem value={1}>Tier2</MenuItem>
                <MenuItem value={2}>Tier3</MenuItem>
                <MenuItem value={3}>Tier4</MenuItem>
                <MenuItem value={4}>Tier5</MenuItem>
                <MenuItem value={5}>Tier6</MenuItem>
                <MenuItem value={6}>Tier7</MenuItem>
                <MenuItem value={7}>Tier8</MenuItem>
                <MenuItem value={8}>Tier9</MenuItem>
                <MenuItem value={9}>Tier10</MenuItem>
            </Select>
            <Box py="5px" borderBottom={'1px solid darkgrey'} display="flex" justifyContent="space-between" width="100%" lineHeight={'30px'}>
                <Box fontWeight="bold">Remaining</Box>
                <Box>{tBalance[tier]} / {maxRegular[tier]}</Box>
            </Box>
            <Box py="5px" borderBottom={'1px solid darkgrey'} display="flex" justifyContent="space-between" width="100%" lineHeight={'30px'}>
                <Box fontWeight="bold">Max Value per Wallet</Box>
                <Box color={userInfo[tier]?.res.length === maxWallet[tier] ? 'red' : 'black'}>{userInfo[tier]?.res.length} / {maxWallet[tier]}</Box>
            </Box>
            <Box py="5px" borderBottom={'1px solid darkgrey'} display="flex" justifyContent="space-between" alignItems="center" width="100%" lineHeight={'30px'}>
                <Box fontWeight="bold">Price</Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Box>
                        {currencyToken.toLowerCase() === AVAX.toLowerCase() ? (Number(priceList[tier] + (flatFee)).toFixed(10)) : ExpToNumber(priceList[tier])} {symbol}
                    </Box> 
                    {currencyToken.toLowerCase() !== AVAX.toLowerCase() && <Box>{flatFee} AVAX</Box>}
                </Box>
            </Box>
            <Box py="5px" borderBottom={'1px solid darkgrey'} mb="20px" display="flex" justifyContent="space-between" alignItems="center" width="100%" lineHeight={'30px'}>
                <Box fontWeight="bold">Quantity</Box>
                <Box display="flex" justifyContent="space-between" maxWidth="106px" width="100%" alignItems="center">
                    <CustomBtn onClick={decrease}>-</CustomBtn>
                    <CustomInput value={amount} onChange={onChange} />
                    <CustomBtn  onClick={increase}>+</CustomBtn>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Box>
                        {currencyToken.toLowerCase() === AVAX.toLowerCase() ? (Number(priceList[tier]*amount + Number(flatFee)).toFixed(10)) : ExpToNumber(priceList[tier] * amount)} {symbol}
                    </Box> 
                    {currencyToken.toLowerCase() !== AVAX.toLowerCase() && <Box>{flatFee} AVAX</Box>}
                </Box>
            </Box>
            <Box>
                <Button variant='outlined' color="warning" onClick={_mint}>Mint</Button>
            </Box>
        </Box>
      </Dialog>
  );
}

const CustomBtn = styled.button`
    border: none;
    outline: none;
    background: transparent;
    padding: 0px;
    font-family: "Bakbak One";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
`

const CustomInput = styled.input`
    max-width: 58px;
    width: 100%;
    border-top: none;
    border-bottom: none;
    border-image: initial;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    height: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    background: transparent;
    padding: 0px 19px;
    outline: none;
    font-family: "Bakbak One";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    text-transform: uppercase;
`