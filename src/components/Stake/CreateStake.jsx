import { Box, Button } from "@mui/material";
import styled from "styled-components";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from 'react-toastify';
import { isExistStakingName, staking, approve } from "../../hooks/useTokenInfo";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

const CreateStake = ({onChnageName, onChangeAmount, isDisabled, onCreateStake,mode,balance,title="Create a Stake", ...props}) => {

    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const {account} = useAuth()
    const [period, setPeriod] = useState(30);
    const Period = [30,90,180,365]
    const Percent = [0,0.25,0.5,0.75,1]

    const changeName = (e) => {
        setName(e.target.value)
        if(onChnageName) onChnageName(e.target.value)
    }

    const changeAmount = (e) => {
        setAmount(Number(e.target.value))
        if(onChangeAmount) onChangeAmount(e.target.value)
    }

    const createStake = async() => {
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
        if(!amount) {
            if(! toast.isActive("amount"))
                toast.warn("Please set your staking amount!",{
                    toastId: "amount",
                })
            return;
        }
        if(amount > balance) {
            if(! toast.isActive("Insufficient balance!"))
                toast.warn("Insufficient balance!",{
                    toastId: "Insufficient balance!",
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
        let duration = 0
        if(mode === Unlocking) duration = 0;
        else if(mode === Irrevisible) duration = -1;
        else duration = period;
        let statement1 , statement2;
        switch (mode) {
            case Locking: statement1 = "Locking"; statement2 = "Locked"; break;
            default: statement1 = "Staking"; statement2 = "Staked"; break;
        }
        await toast.promise(approveAndStaking(name, duration, amount, account), {
            pending: `${statement1} Now`,
            success: `You ${statement2}`,
            error: `${statement1} canceled`
        })
        if(onCreateStake) onCreateStake()
        setName("")
        setAmount("")
    }

    const approveAndStaking = async(name, duration, amount, account) => {
        await approve(account, amount)
        await staking(name, duration, amount, account)
    }

    const onChangePeriod = (event, newValue) => {
        if (typeof newValue === 'number') {
            setPeriod(Period[newValue]);
        }
    }

    const onChangeMax = (event, newValue) => {
        if (typeof newValue === 'number') {
            setAmount(Math.floor(Percent[newValue] * balance))
            if(onChangeAmount) onChangeAmount(Math.floor(Percent[newValue] * balance))
        }
    }

    return <Box display="flex" flexDirection={"column"} border="1px solid rgba(0,0,0,.125)" bgcolor="white" {...props}>
        <Box p="0.75rem 1.25rem" bgcolor="rgba(0,0,0,.03)" borderBottom="1px solid rgba(0,0,0,.125)" fontSize="22px">{title}</Box>
        <Box display="flex" p="1.25rem" flexDirection="column">
            <CustomInput type="text" placeholder="Name" value={name} onChange={changeName} style={{marginBottom: '20px'}} />
            <CustomInput type="text" placeholder="Amount Of Token" value={amount} onChange={changeAmount} style={{marginBottom: `20px`}} />
            <Stack direction="row" sx={{ mx: 3 }} alignItems="center">
                <Box sx={{ width: '100%' }}>
                    <Slider
                        aria-label="Restricted values"
                        key={`slider-${0}`}
                        max={4}
                        defaultValue={0}
                        getAriaValueText={valuePercent}
                        step={null}
                        // valueLabelDisplay="auto"
                        marks={pMarks}
                        onChange={onChangeMax}
                    />
                </Box>
            </Stack>
            {mode === Locking && 
                <Stack spacing={2} direction="row" sx={{ mr: 3 }} alignItems="center">
                    <Box fontSize={14} >Locking Period</Box>
                    <DiscreteSliderValues onChangeValue={onChangePeriod} />
                </Stack>
            }
        </Box>
        <Box display="flex" p="1.25rem">
            <Button variant="contained" color="success" disabled={isDisabled} onClick={createStake}>Confirm</Button>
        </Box>
    </Box>
}

export default CreateStake;

export const CustomInput = styled.input`
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    border-radius: 2px;
    :focus {
        color: #495057;
        background-color: #fff;
        border-color: rgb(243, 183, 230);
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(243, 183, 230, 0.25);
    }
`

export const Unlocking = 0;
export const Locking = 1;
export const Irrevisible = 2;

const pMarks = [
    {
        value: 0,
        label: '0%',
    },
    {
        value: 1,
        label: '25%',
    },
    {
        value: 2,
        label: '50%',
    },
    {
        value: 3,
        label: '75%',
    },
    {
        value: 4,
        label: 'Max',
    },
]

const marks = [
  {
    value: 0,
    label: '1 month',
  },
  {
    value: 1,
    label: '3 months',
  },
  {
    value: 2,
    label: '6 months',
  },
  {
    value: 3,
    label: '1 year',
  },
];

function valuetext(value) {
    if(value > 180)
        return `1 year`;
    else return `${value/30} months`
}

function valuePercent(v) {
    switch (v) {
        case 0: return '0%';
        case 1: return '25%'
        case 2: return '50%'
        case 3: return '75%'
        default: return 'Max'
    }
}

export function DiscreteSliderValues({onChangeValue}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Slider
        aria-label="Restricted values"
        key={`slider-${0}`}
        max={3}
        defaultValue={0}
        getAriaValueText={valuetext}
        step={null}
        // valueLabelDisplay="auto"
        marks={marks}
        onChange={onChangeValue}
      />
    </Box>
  );
}
