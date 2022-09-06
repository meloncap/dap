import React, { useMemo, useState } from 'react';

export const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const defaultVal = {
    totalMarketHistory: [
        {name: MONTH[0], pv: 0},
        {name: MONTH[1], pv: 0},
        {name: MONTH[2], pv: 0},
        {name: MONTH[3], pv: 0},
        {name: MONTH[4], pv: 0},
        {name: MONTH[5], pv: 0},
        {name: MONTH[6], pv: 0},
        {name: MONTH[7], pv: 0},
        {name: MONTH[8], pv: 0},
        {name: MONTH[9], pv: 0},
        {name: MONTH[10], pv: 0},
        {name: MONTH[11], pv: 0},
    ],
    setTotalMarketHistory: () => { },
    buybackHistory: [
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
        {date: "no data", amount: 0,},
    ],
    setBuybackHistory: () => {},
    burnkHistory: [
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
    ],
    setBurnHistory: () => {},
    airdropHistory: [
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
    ],
    setAirdropHistory: () => {},
    jackpotHistory: [
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
        {date: "no data", amount: 0},
    ],
    setJackpotHistory: () => {},
}

export const TransactionHandleContext = React.createContext(defaultVal)

export default function useTransaction() {
    return React.useContext(TransactionHandleContext);
}

export function TransactionHandleProvider({ children }) {
    const [totalMarketHistory, _setTotalMarketHistory] = useState(defaultVal.totalMarketHistory)
    const [buybackHistory, _setBuybackHistory] = useState(defaultVal.buybackHistory)
    const [burnkHistory, _setBurnHistory] = useState(defaultVal.burnkHistory)
    const [airdropHistory, _setAirdropHistory] = useState(defaultVal.airdropHistory)
    const [jackpotHistory, _setJackpotHistory] = useState(defaultVal.jackpotHistory)

    useMemo(() => {

        // eslint-disable-next-line
    }, [window.ethereum])

    const setTotalMarketHistory = (data) => {
        _setTotalMarketHistory(data)
    }

    const setBuybackHistory = (data) => {
        if(!data || !data.length) return;
        _setBuybackHistory(data)
    }

    const setBurnHistory = (data) => {
        if(!data || !data.length) return;
        _setBurnHistory(data)
    }

    const setAirdropHistory = (data) => {
        if(!data || !data.length) return;
        _setAirdropHistory(data)
    }

    const setJackpotHistory = (data) => {
        if(!data || !data.length) return;
        _setJackpotHistory(data)
    }

    return <TransactionHandleContext.Provider 
                value={{ 
                    totalMarketHistory, 
                    setTotalMarketHistory, 
                    buybackHistory, 
                    setBuybackHistory, 
                    burnkHistory, 
                    setBurnHistory,
                    airdropHistory,
                    setAirdropHistory,
                    jackpotHistory,
                    setJackpotHistory
                }} 
                children={children} 
            />;
}