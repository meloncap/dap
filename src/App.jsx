import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blank from './pages/Blank'
import Dashboard from './pages/Dashboard'
import MainLayout from './layout/MainLayout'
import Treasury from './pages/Treasury'
import Buyback from './pages/Buyback'
import Airdrop from './pages/Airdrop'
import useTransaction from './hooks/useTransaction'
import React, {useEffect} from 'react'
import axios from 'axios';
import { APIEndpoint, APIKey, DeadWallet, BuybackWallet, LP } from './utils/constant'
import { subtractDates, getDateFormat } from './utils/calculation'
import _ from 'lodash'
import Staking from './pages/Staking'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Locking from './pages/Locking'
import NodePage from './pages/Node'
import NFTStakingPage from './pages/NFTStakingPage'
import Minting from './pages/Minting'
import Manage from './pages/Manage'
import Redeem from './pages/Redeem'

function App() {
    const {setTotalMarketHistory, setBuybackHistory, setBurnHistory, setAirdropHistory, setJackpotHistory} = useTransaction()

    const fetchTransactions = async () => {
        const _marketCapPriceList = []
        const from = getDateFormat(subtractDates(365));

        const to = getDateFormat(subtractDates(0));
        const url = APIEndpoint + "v1/pricing/historical_by_addresses_v2/43114/USD/" +
                "0x726573a7774317DD108ACcb2720Ac9848581F01D" + 
                "/?quote-currency=USD&format=JSON" + 
                `&from=${from.year}-${from.mon}-${from.day}&to=${to.year}-${to.mon}-${to.day}` +
                `&page-size=365&key=${APIKey}`
        let res = await axios.get(url)
        res = res.data.data[0];
        // let holding;
        for(let i = 364; i >= 0; i--) {
            if(i < res.items.length) {
                _marketCapPriceList.push({ name: res.items[i].date, pv: res.items[i].price * 1000000000000 })
                continue
            }
            // _marketCapPriceList.push({ name: getDateFormat(subtractDates(i)).stringDate, pv: 0 })
        }

        setTotalMarketHistory(_marketCapPriceList)
    }

    const loadData = async(_airdropHistory=[], _jackpotHistory=[], _buybackHistory = [], _burnHistory = []) => {
        const url = `${APIEndpoint}v1/43114/address/0x726573a7774317dd108accb2720ac9848581f01d/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-size=2000&key=${APIKey}`
        console.log(url)
        const {data} = await axios(url);
        _.each(data.data.items, each=>{
            if(each?.from_address === BuybackWallet) {
                _.each(each?.log_events, log=>{
                    if(!log?.decoded || (log.decoded.name !== "Transfer" && log.decoded.name !== "Swap")) return;
                    if(log.sender_address.toLocaleLowerCase() !== ("0x726573a7774317dd108accb2720ac9848581f01d").toLocaleLowerCase() && log.sender_address.toLocaleLowerCase() !== LP.toLocaleLowerCase() ) return;

                    _.each(log.decoded.params, param=>{
                        if(param.name === "to" && param.value.toLocaleLowerCase() === BuybackWallet.toLocaleLowerCase() && log.decoded.name === "Swap"){
                            _buybackHistory.unshift({date: log.block_signed_at.slice(0, 10), amount: Number(log.decoded.params[3].value) / 10**18, tx: log.tx_hash, blockNum: log.block_height})
                        } else if (param.name === "from" && param.value.toLocaleLowerCase() === BuybackWallet.toLocaleLowerCase() && log.sender_address === "0x726573a7774317dd108accb2720ac9848581f01d") {
                            _airdropHistory.unshift({date: log.block_signed_at.slice(0, 10), amount: Number(log.decoded.params[2].value) / 10**18,reciever: log.decoded.params[1].value, tx: log.tx_hash})
                        } else if(param.name === "to" && param.value.toLocaleLowerCase() === DeadWallet.toLocaleLowerCase()){
                            _burnHistory.unshift({date: log.block_signed_at.slice(0, 10), amount: Number(log.decoded.params[2].value) / 10**18, tx: log.tx_hash})
                        }
                    })
                })
            }
        })
        setBuybackHistory(_buybackHistory);
        setBurnHistory(_burnHistory);
        setAirdropHistory(_airdropHistory)
        setJackpotHistory(_jackpotHistory)
    }

    useEffect(() => {
        fetchTransactions();
        loadData()
        // eslint-disable-next-line
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="treasury" element={<Treasury />} />
                    <Route path="buyback" element={<Buyback />} />
                    <Route path="airdrops" element={<Airdrop />} />
                    <Route path="stake" element={<Staking />} />
                    <Route path="lock" element={<Locking />} />
                    <Route path="node" element={<NodePage />} />
                    <Route path="stakeNFT" element={<NFTStakingPage />} />
                    <Route path="bonding" element={<Blank />} />
                    <Route path="mint" element={<Minting />} />
                    <Route path="manage" element={<Manage />} />
                    <Route path="borrow" element={<Redeem />} />
                    <Route path="market" element={<Blank />} />
                    <Route path="involve" element={<Blank />} />
                    <Route path="incubation" element={<Blank />} />
                    <Route path="update" element={<Blank />} />
                </Route>
            </Routes>
            <ToastContainer style={{fontSize: '15px', width: '400px', fontWeight: 'bold'}} position="top-center" theme='colored' />
        </BrowserRouter>
    )
}

export default App
