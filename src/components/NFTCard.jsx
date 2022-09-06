import { Box, Button, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { StakeNFT, isExistStakingName } from "../hooks/useTokenInfo";
import { CustomInput } from "./Stake/CreateStake";

const NFTCard = ({uri, onSelected, tokenId, onToggle,close,staked, ...props}) => {
    const [isOpen, setOpen] = useState(false)
    const [name, setName] = useState("")
    const {account} = useAuth()

    useEffect(()=>{
        if(close) setOpen(false)
    }, [close])
    
    const toggle = () => {
        if(!isOpen)
            onToggle(tokenId)
        setOpen(!isOpen)
        setName("")
    }

    const NFTStake = async() => {
        if(!account) {
            toast.warn("You should connect your wallet!", {
                toastId: "account",
            })
            return;
        }
        if(!name) {
            if(! toast.isActive("nameEmpty"))
                toast.warn("Please set your staking name!",{
                    toastId: "nameEmpty",
                })
            return;
        }
        if(await isExistStakingName(name, account)) {
            if(! toast.isActive("duplicatedName"))
                toast.warn("Duplicated staking name. Please set again.",{
                    toastId: "nameEmpty",
                })
            return;
        }
        await toast.promise(StakeNFT(account, name, tokenId), {
            pending: "Staking Now...",
            success: "Success!",
            error: "Canceled",
        })
        staked()
        setName("")
    }

    return <Box flexDirection="column" justifyContent="center" width="300px" minWidth="300px" minHeight={'300px'} borderRadius="5px" overflow="hidden" display="flex" {...props}>
        <Box component="img" width="300px" src={uri}  zIndex={1} />
        <NFTCardButton py="10px" onClick={toggle} fontSize="18px" fontWeight="500" color="white"  zIndex={1}>
            Stake NFT
        </NFTCardButton>
        <Box display="flex" height="60px">
            <NFTCardInput py="10px" style={{transform: isOpen ? 'translateY(0)' : 'translateY(-100%)'}}>
                <CustomInput placeholder="Name" style={{width: '150px'}} onChange={e=>{setName(e.target.value)}} value={name} />
                <Box component={Button} variant="contained" ml="10px" onClick={NFTStake}>Confirm</Box>
            </NFTCardInput>
        </Box>
    </Box>
}

export default NFTCard;

export const NFTCardContainer = styled(Box)`
    overflow-x: auto;
    display: flex;
    padding-bottom: 10px;
    padding-top: 10px;
    ::-webkit-scrollbar {
        height: 5px;
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        border-radius: 5px;
    }
`

export const NFTCardButton = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 18px;
    color: white;
    background-color: #f3b7e6;
    &:hover {
        cursor: pointer;
        background-color: #f78adf;
    }
`

const NFTCardInput = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px #f3b7e6 solid;
    transition: transform 0.3s;
`