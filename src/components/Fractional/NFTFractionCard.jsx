import { Box, styled, Button, NativeSelect } from "@mui/material";
import React, { useEffect, useState } from "react";
import { borrow, downgradeNFT, fractionlize, getTierInfo, getTokenName, updateNFT, updateURI, redeem, canUpgrade, canDowngrade, canFraction, canUpdateURI, canBorrow, canRedeem, canDoRoyalty } from "../../hooks/useTokenInfo";
import { Borrow, Downgrade, Fractionalize, UpdateURI, Upgrade, ModeList, Holding, Grace, Extra } from "../../pages/Manage";
import { ExpToNumber, numberWithCommas, shortAddr } from "../../utils/calculation";
import { AVAX } from "../../utils/constant";
import { NFTCardButton } from "../NFTCard";
import _ from "lodash";
import { CustomInput } from "../Stake/CreateStake";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

export const NFTTypeList = ['Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5', 'Tier6', 'Tier7', 'Tier8', 'Tier9', 'Tier10', 'Fractional NFT']

const NFTFractionCard = ({
    tokenId, 
    mode,
    priceList, 
    flatFee, 
    onUpdate,
    borrowFee,
    maxTier0, 
    maxRegular,
    poolFraction,
    borrowTime, 
    redeemFee, 
    holdPeriod, 
    gracePeriod,
    discountFee,
    graceFee,
    balance,
    maxWallet,
    userInfo, 
    ...props
}) => {
    const [toggle, setToggle] = useState(false)
    const [tokenType, setType] = useState()
    const [minter, setMinter]= useState("")
    const [currency, setCurrency] = useState("")
    const [symbol, setSymbol] = useState("")
    const [selectedTier, setSelectedTier] = useState("")
    const [royaltiFee, setRoyaltiFee] = useState(0)
    const {account, login} = useAuth()
    const [uri, setUri] = useState("")
    const [tokenUri, setTokenUri] = useState("")
    const [royaltyOption, setRoyaltyOption] = useState(0)

    useEffect(()=>{
        (async()=>{
            const {tierInfo, royalty, royaltiFee, tokenUri, royaltyOption} = await getTierInfo(tokenId)
            setType(tierInfo)
            setMinter(royalty.user)
            setCurrency(royalty.mintCurrency)
            setRoyaltiFee(royaltiFee / 100)
            const {data} = await axios.get(tokenUri);
            setTokenUri(data.image)
            setRoyaltyOption(royaltyOption)

            if(royalty.mintCurrency.toLowerCase() === AVAX.toLowerCase()) {
                setSymbol("AVAX")
            } else {
                const _symbol = await getTokenName(royalty.mintCurrency)
                setSymbol(_symbol)
            }
        })()
        setToggle(false)
    },[tokenId])

    useEffect(()=>{
        setSelectedTier("")
    }, [mode])

    const _upgradeNFT = async()=>{
        if(selectedTier === "" || isNaN(Number(selectedTier))) return;
        const fee = priceList[tokenType] * royaltiFee
        let price = flatFee + (priceList[selectedTier] - priceList[tokenType])
        if(maxWallet[selectedTier] < userInfo[10 - selectedTier]?.res.length + 1) {
            toast.warn("Cannot upgrade with this tier. Your wallet is up to limit", {toastId: 'No Upgradable mode'})
            return;
        }
        price = price.toFixed(10)
        const res = await canUpgrade(price, account, selectedTier )
        if(res?.noUpgradable) {
            toast.warn("No Upgradable mode", {toastId: 'No Upgradable mode'})
            return;
        }
        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }
        if(res?.mintlimit) {
            toast.warn("Cannot mint anymore", {toastId: 'Insufficient balance'})
            return;
        }
        
        if(!isOverflowOfBalance(selectedTier)) {
            toast.warn("Your total amount will overflow the limitation!", {toastId: 'No downgrade mode'})
            return;
        }
        await toast.promise(updateNFT(tokenId, selectedTier, account, price.toString(), currency, fee), {
            pending: "Upgrading ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        
        onUpdate()
    }

    const _downGrade = async()=>{
        if(selectedTier === ""|| isNaN(Number(selectedTier))) return;
        if(maxWallet[selectedTier] < userInfo[10 -selectedTier]?.res.length + 1) {
            toast.warn("Cannot downgrade with this tier. Your wallet is up to limit", {toastId: 'No downgrade mode'})
            return;
        }
        const fee = priceList[tokenType] * royaltiFee
        const price = flatFee
        const tier0From = maxTier0 / maxRegular[tokenType]
        const tier0To = maxTier0 / maxRegular[selectedTier]
        const res = await canDowngrade(tier0From-tier0To, account, flatFee)

        if(res?.noUpgradable) {
            toast.warn("No Downgradable mode", {toastId: 'No Upgradable mode'})
            return;
        }

        if(res?.mintlimit) {
            toast.warn("Cannot mint anymore", {toastId: 'Insufficient balance'})
            return;
        }

        if(res?.fractionLimit) {
            toast.warn("Your fractional NFT amount is up to limit", {toastId: 'Insufficient balance'})
            return;
        }

        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }

        if(res?.tokenLimit) {
            toast.warn("Cannot downgrade with this tier. Your wallet is up to limit", {toastId: 'No downgrade mode'})
            return;
        }

        await toast.promise(downgradeNFT(tokenId, selectedTier, account, price.toString(), currency, fee), {
            pending: "Downgrading ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        onUpdate()
    }

    const _fractionalize = async() => {
        const fee = priceList[tokenType] * royaltiFee
        const price = flatFee
        const fractionAmount = maxTier0 / maxRegular[tokenType];
        const res = await canFraction(fractionAmount, account, flatFee)
        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }
        if(res?.mintlimit) {
            toast.warn("Cannot mint fraction tokens anymore", {toastId: 'Insufficient balance'})
            return;
        }
        if(res?.fractionLimit) {
            toast.warn("Your fraction amount is up to limit", {toastId: 'Insufficient balance'})
            return;
        }
        await toast.promise(fractionlize(tokenId, account, price.toString(), currency, fee), {
            pending: "Fractionalizing ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        onUpdate()
    }

    const _updateURI = async() => {
        const fee = priceList[tokenType] * royaltiFee
        const price = flatFee
        const res = await canUpdateURI(account, flatFee)

        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }

        if(res?.ableUpdateURI) {
            toast.warn("Not available mode for update uri", {toastId: 'Insufficient balance'})
            return;
        }
        await toast.promise(updateURI(tokenId, uri, account, price.toString(), currency, fee), {
            pending: "UPdating uri ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        onUpdate()
    }

    const _borrow = async() => {
        let amount = maxTier0 / maxRegular[tokenType]
        amount = amount * borrowFee / 100;
        if(poolFraction < amount) {
            toast.warn("Insufficient of Pool balance", {toastId: 'Insufficient balance'})
            return;
        }
        const res = await canBorrow(amount, flatFee, account)

        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }
        if(res?.noborrowable) {
            toast.warn("Not available mode for Borrow", {toastId: 'Insufficient balance'})
            return;
        }
        if(res?.fractionLimit) {
            toast.warn("Your fraction amount is up to limit", {toastId: 'Insufficient balance'})
            return;
        }
        if(royaltyOption !== 0) {
            const dealWithRoyalty = await canDoRoyalty(currency, royaltiFee, priceList[tokenType], account)
            if(!dealWithRoyalty) {
                toast.warn(`Insufficient of ${symbol} token balance`, {toastId: 'Insufficient balance'})
                return;
            }
        }
        
        const fee = priceList[tokenType] * royaltiFee
        const price = flatFee
        await toast.promise(borrow(tokenId, account, price.toString(), currency, fee, royaltyOption), {
            pending: "Borrowing ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        onUpdate()
    }

    const _redeem = async() => {
        let _account = account;
        if(!_account) {
            _account = await login()
        }
        const fee = priceList[tokenType] * royaltiFee
        const price = flatFee
        const receive = getRedeemAmount();
        if(Number(balance) < Number(receive)) {
            toast.warn("Insufficient balance of Fraction NFTs", {toastId: 'lackoffraction'})
            return;
        }
        if(maxWallet[tokenType] < userInfo[10 - tokenType]?.res.length + 1) {
            toast.warn("Cannot redeem with this tier. Your wallet is up to limit", {toastId: 'No Upgradable mode'})
            return;
        }
        const res = await canRedeem(flatFee, _account);
        if(res?.insufficient) {
            toast.warn("Insufficient balance", {toastId: 'Insufficient balance'})
            return;
        }
        if(royaltyOption !== 0) {
            const dealWithRoyalty = await canDoRoyalty(currency, royaltiFee, priceList[tokenType], _account)
            if(!dealWithRoyalty) {
                toast.warn(`Insufficient of ${symbol} token balance`, {toastId: 'Insufficient balance'})
                return;
            }
        }
        await toast.promise(redeem(tokenId, _account, price.toString(), currency, fee, royaltyOption), {
            pending: "Redeem ...",
            success: "Success!",
            error: "Something went wrong!",
        })
        onUpdate()
    }

    const isOverflowOfBalance = (tierId) => {
        let total = 0, maxLimit = 0; 
        for(let i = 1; i <= 10; i++) {
            total += maxTier0 / maxRegular[11-i] * userInfo[i]?.res.length;
            maxLimit += maxTier0 / maxRegular[11-i] * maxWallet[11-i]
        }
        total += maxTier0 / maxRegular[tierId]
        if(maxLimit < total) return false;
        return true;
    }
    const renderMangerComponent = () => {
        switch(mode) {
            case Upgrade:
                return <Box display="flex" justifyContent="space-between" width="100%" mb="5px">
                    <NativeSelect
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedTier}
                        onChange={(e)=>{setSelectedTier(Number(e.target.value))}}
                        variant="standard"
                        color="warning"
                    >
                        <option value="">
                            <em>None</em>
                        </option>
                        {
                            _.map(NFTTypeList, (each, index)=>{
                                if(index <= tokenType || index === 10) return null;
                                return <option value={index}>{each}</option>
                            })
                        }
                    </NativeSelect>
                    <Button variant="contained" color="info" size="small" onClick={_upgradeNFT}>{ModeList[mode]}</Button>
                </Box>
            case Downgrade:
                return <Box display="flex" justifyContent="space-between" width="100%" mb="5px">
                    <NativeSelect
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={selectedTier}
                        onChange={(e)=>{setSelectedTier(Number(e.target.value))}}
                        variant="standard"
                        color="warning"
                    >
                        <option value="">
                            <em>None</em>
                        </option>
                        {
                            _.map(NFTTypeList, (each, index)=>{
                                if(index >= tokenType) return null;
                                return <option value={index}>{each}</option>
                            })
                        }
                    </NativeSelect>
                    <Button variant="contained" color="warning" size="small" onClick={_downGrade}>{ModeList[mode]}</Button>
                </Box>
            case Fractionalize:
                return <Box display="flex" width="100%" mb="5px" justifyContent="center">
                    <Button variant="contained" color="error" size="small" onClick={_fractionalize}>{ModeList[mode]}</Button>
                </Box>
            case UpdateURI:
                return <Box display="flex" justifyContent="space-between" width="100%" mb="5px">
                    <CustomInput style={{width: '150px', height: "30px", marginRight: "10px"}} value={uri} onChange={(e)=>{setUri(e.target.value)}} />
                <Button variant="contained" color="warning" size="small" onClick={_updateURI}>{ModeList[mode]}</Button>
            </Box>
            case Borrow:
                if(tokenType === 10) return;
                const receive = maxTier0 / maxRegular[tokenType] * borrowFee / 100;
                return  <Box display="flex" flexDirection="column">
                            <Box display="flex" justifyContent="space-between" width="100%" mb="9px">
                                <Box fontWeight="bold">Receive amount</Box>
                                <Box>{numberWithCommas(receive)}</Box>
                            </Box>
                            <Box display="flex" justifyContent="center">
                                <Button variant="contained" color="success" size="small" disabled={poolFraction < receive} onClick={_borrow}>Borrow</Button>
                            </Box>
                </Box>
            case Holding:
            case Grace:
            case Extra:
                return <Box display="flex" flexDirection="column">
                            <Box display="flex" justifyContent="space-between" width="100%" mb="9px">
                                <Box fontWeight="bold">Borrowed Time</Box>
                                <Box>{new Date(borrowTime * 1000).toLocaleString("en", { hour12: false }).slice(0, 16)}</Box>
                            </Box>
                            <Box display="flex" justifyContent="center" color="#ff64dd">
                                <Button variant="outlined" color="inherit" size="small" onClick={_redeem} >Redeem</Button>
                            </Box>
                </Box>
            default:
                return null;
        }
    }

    const getRedeemAmount = () => {
        let amount = tokenType && maxRegular && maxRegular[tokenType] ? maxTier0 / maxRegular[tokenType] : 0;
        let deltatime = new Date();
        deltatime = deltatime / 1000 - borrowTime
        let rate;
        if(deltatime < holdPeriod && mode === Holding) rate = borrowFee*100 + redeemFee * borrowFee;
        else if (deltatime < holdPeriod + gracePeriod && mode === Grace) rate = borrowFee * 100 + (redeemFee + graceFee) * borrowFee
        else if (deltatime > holdPeriod + gracePeriod && mode === Extra) rate = (100 - discountFee) * 100;
        return amount * rate / 10000;
    }

    return <Box flexDirection="column" justifyContent="center" width="300px" minWidth="300px" minHeight={'300px'} borderRadius="5px" overflow="hidden" position="relative" display="flex" {...props}>
    <Box component="img" width="300px" height="300px" src={tokenUri}  zIndex={1} />
    <NFTCardButton py="10px" fontSize="18px" fontWeight="500" color="white" zIndex={2} onClick={()=>{setToggle(!toggle)}}>
        {mode < Holding ? 'Mange NFT' : 'Redeem NFT'}
    </NFTCardButton>
    <NFTMangeComponent style={{transform: toggle ? 'translateY(0)' : 'translateY(100%)'}}>
        <Box component="h2" mb="10px" color="#ff64dd">{ModeList[mode]}</Box>
        <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%">
            <Box display="flex" justifyContent="space-between" width="100%" mb="10px">
                <Box fontWeight="bold">TokenId</Box>
                <Box>{tokenId}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" mb="10px">
                <Box fontWeight="bold">Type</Box>
                <Box>{tokenType === null? "" : NFTTypeList[tokenType]}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" mb="10px">
                <Box fontWeight="bold">Minter</Box>
                <Box color="blue"><a href={`https://snowtrace.io/address/${minter}`} target="_blank" rel="noreferrer">{shortAddr(minter, 6)}</a></Box>
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" mb="10px">
                <Box fontWeight="bold">Price</Box>
                {mode > Borrow && mode <= Extra ? 
                    <Box>{getRedeemAmount()} Fractions</Box>
                    : 
                    <Box>{ExpToNumber(priceList[tokenType])} {symbol}</Box>}
            </Box>
            {renderMangerComponent()}
        </Box>
    </NFTMangeComponent>
</Box>
}

export default NFTFractionCard;

const NFTMangeComponent = styled(Box)`
    position: absolute;
    left: 0;
    top: 40px;
    background-color: #fceff9f1;
    width: 100%;
    height: 260px;
    z-index: 1;
    transition: transform 0.2s;
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: center;
    color: black;
    justify-content: space-between;
`