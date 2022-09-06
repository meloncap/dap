import React, { useEffect, useState } from "react";
import AChart from "../components/Chart/AChart";
import ChartWraper from "../components/Chart/ChartWraper";
import LChart from "../components/Chart/LChart";
import CChart from "../components/Chart/CChart";
import PageContainer from "../components/PageContainer";
import BChart from "../components/Chart/BChart";
import TotalMacketCap from "../components/Chart/TotalMacketCap";
import Title from "../components/Title";
import Cummulative from "../components/Cummulative";
import useAuth from "../hooks/useAuth";
import {
   getUserCheemsXInfo,
} from "../hooks/useTokenInfo";
import { numberWithCommas } from "../utils/calculation";
import {
  CheemsX,
  LP,
  LPDriver,
  TreasuryDriver,
  AirDropDriver,
  DeadWallet,
  APIEndpoint, 
  APIKey,
  ChainId,
  GetBalanceEndpoint,
  CheemsXMain,
  AvaxAPIKey,
} from "../utils/constant";
import _ from "lodash";
import axios from 'axios'
import useTransaction from "../hooks/useTransaction";

const Dashboard = () => {
  const { account } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [totalInfo, setTotalInfo] = useState({});
  const [reflection, setReflection] = useState(0)
  const [pieData, setPieData] = useState([
    { name: "Community", value: 100, color: "#0088FE" },
    { name: "Liquidity", value: 0, color: "#8624DB" },
    { name: "Lp Driver", value: 0, color: "#00C49F" },
    { name: "Treasury Driver", value: 0, color: "#FFBB28" },
    { name: "Airdrop Driver", value: 0, color: "#FF8042" },
    { name: "Burnt", value: 0, color: "#252525" },
  ]);
  const [totalBalanceList, setTotalBalanceList] = useState([])
  const {totalMarketHistory} = useTransaction()

  useEffect(()=>{
    (async()=>{

      let lp = await axios.get(`${GetBalanceEndpoint}contractaddress=${CheemsXMain}&address=${LP}&tag=latest&apikey=${AvaxAPIKey}`);
      let lpDriver = await axios.get(`${GetBalanceEndpoint}contractaddress=${CheemsXMain}&address=${LPDriver}&tag=latest&apikey=${AvaxAPIKey}`);
      let treasury = await axios.get(`${GetBalanceEndpoint}contractaddress=${CheemsXMain}&address=${TreasuryDriver}&tag=latest&apikey=${AvaxAPIKey}`);
      let airdrop = await axios.get(`${GetBalanceEndpoint}contractaddress=${CheemsXMain}&address=${AirDropDriver}&tag=latest&apikey=${AvaxAPIKey}`);
      let dead = await axios.get(`${GetBalanceEndpoint}contractaddress=${CheemsXMain}&address=${DeadWallet}&tag=latest&apikey=${AvaxAPIKey}`);
      const deadBalance = dead.data.result;
      lp = lp.data.result / 1000000000000 / 10**18 * 100;
      lpDriver = lpDriver.data.result / 1000000000000/ 10**18 * 100;
      treasury = treasury.data.result / 1000000000000/ 10**18 * 100;
      airdrop = airdrop.data.result / 1000000000000/ 10**18 * 100;
      dead = dead.data.result / 1000000000000/ 10**18 * 100;
      const community = 100 - lp - lpDriver - airdrop - dead - treasury ;
      setPieData([
        { name: "Community", value: community, color: "#0088FE" },
        { name: "Liquidity", value: lp, color: "#8624DB" },
        { name: "Lp Driver", value: lpDriver, color: "#00C49F" },
        { name: "Treasury Driver", value: treasury, color: "#FFBB28" },
        { name: "Airdrop Driver", value: airdrop, color: "#FF8042" },
        { name: "Burnt", value: dead, color: "#252525" },
      ])
      const LPInfo = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/avalanche/${LP}`)
      setTotalInfo({deadAmount: numberWithCommas(deadBalance / 10 ** 18 / 10000000000, 2), LP: numberWithCommas(LPInfo.data.pair.liquidity.usd,2)})
    })()

  },[])

  useEffect(() => {
    if(!account) return;
    (async () => {
      const { balance, reflection } = await getUserCheemsXInfo(
        account
      );
      const tmpUserInfo = _.cloneDeep(userInfo)
      console.log(tmpUserInfo,"balance")
      tmpUserInfo.balance = numberWithCommas(balance / 10 ** 18, 3);
      tmpUserInfo.reflection = numberWithCommas(reflection / 10 ** 18, 2)
      setUserInfo(tmpUserInfo);
      let url = `${APIEndpoint}v1/${ChainId}/address/${account}/portfolio_v2/?quote-currency=USD&format=JSON&key=${APIKey}`
      let res = await axios.get(url)
      res = res.data.data.items;
      let holding;
      for(let i = 0; i < res.length; i++) {
          if(res[i].contract_address.toLocaleLowerCase() === CheemsX.toLocaleLowerCase()) {
              holding = res[i].holdings;
          }
      }
      const _tBalanceList = [];
      _.map(holding, (each, index)=>{
        if(index % 4 !== 0) return;
        _tBalanceList.push({name: each.timestamp.slice(0,10), pv:each.open.balance/10**18})
      })
      // _.map(lpHolding, (each, index)=>{
      //   if(index % 4 !== 0) return;
      //   _lpList.push({name: each.timestamp.slice(0,10), pv:each.open.balance/10**18})
      // })

      // setLPList(_lpList)
      setTotalBalanceList(_tBalanceList)
      url = `${APIEndpoint}v1/${ChainId}/address/${account}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${CheemsX}&page-size=1000&key=${APIKey}`
      console.log(url)
      res = await axios.get(url)
      res = res.data.data;
      let total = 0;
      _.map(res.items, each=>{
        total += each.transfers[0].delta / 10**18
      })
      console.log(total)
      setReflection(total - balance / 10 ** 18)
    })();
    // eslint-disable-next-line
  }, [account]);

  return (
    <PageContainer>
      <Title title="My Portfolio" mb="50px" />
      <ChartWraper>
        <AChart
          className="col1"
          value={userInfo?.balance}
          title="My CheemsX Balance"
          data={totalBalanceList}
        />
        <LChart
          className="col2"
          value={numberWithCommas(reflection,2)}
          title="Total Reflection"
        />
        <CChart
          className="col3"
          value={`${totalInfo?.deadAmount ? totalInfo.deadAmount : 0}%`}
          title="Total Burnt"
        />
        <BChart className="col4" value={`$${totalInfo?.LP}`} title="Total LP" /*data={lpList}*/ />
        <TotalMacketCap
          className="col5"
          value={`$${numberWithCommas(totalMarketHistory[totalMarketHistory.length-1].pv, 2)}`}
          title="Total Market Cap"
        />
      </ChartWraper>
      <Cummulative pieData={pieData} />
    </PageContainer>
  );
};

export default Dashboard;
