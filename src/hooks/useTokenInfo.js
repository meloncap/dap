import _ from "lodash";
import ERC20ABI from "../contracts/CheemsXABI.json";
import LockupAPI from "../contracts/Lockup.json"
import ERC721ABI from "../contracts/ERC721.json"
import FractionalABI from "../contracts/Fractional.json"
import Web3 from "web3"
// import { numberWithCommas } from "../utils/calculation";
import { CheemsX, CheemsXNFT, GuarantNFT, Lockup, FractionalAddress, MulticallAddress, RPC_URL, AVAX } from "../utils/constant"
import { multicall } from '@defifofum/multicall';

// const Hour = 3600;
// const Day = 24 * Hour;
// const Year = 365 * Day;

export const setNetworkProvider = (api = LockupAPI, address = Lockup) => {
    return new window.web3.eth.Contract(api, address);
}

const converNumber2Str = (amount, decimals = 18) => {
    return '0x' + (Math.round(amount * Math.pow(10, decimals))).toString(16)
}

export const getUserBalance = async (account) => {
    if (!account) return 0;
    const Cheemsx = await new window.web3.eth.Contract(ERC20ABI, CheemsX);
    const Decimal = await Cheemsx.methods.decimals().call();
    const balance = await Cheemsx.methods.balanceOf(account).call();
    return balance / Math.pow(10, Decimal);
}

export const getAllowance = async (account) => {
    const Lockup = await setNetworkProvider();
    const Cheemsx = await new window.web3.eth.Contract(ERC20ABI, CheemsX);
    return await Cheemsx.methods.allowance(account, Lockup).call();
}

export const approve = async (account, amount) => {
    if (!account) return;
    const Cheemsx = new window.web3.eth.Contract(ERC20ABI, CheemsX);
    return await Cheemsx.methods.approve(Lockup, converNumber2Str(amount)).send({ from: account });
}

export const isExistStakingName = async (name, account) => {
    if (!name) return true;
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.isExistStakeId(name).call({ from: account });
}

export const staking = async (name, duration, amount, account) => {
    const Lockup = setNetworkProvider();
    await Lockup.methods.stake(name, duration, converNumber2Str(amount)).send({ from: account });
}

export const getUserUnclaimedRewardAll = async (account) => {
    const Lockup = await setNetworkProvider();
    console.log("***********************************asdf")
    const res = await Lockup.methods.unclaimedAllRewards(account, 0, true).call();
    console.log("***********************************", res)
    return res / Math.pow(10, 18);
}

export const getUserUnclaimRewardByName = async (name, account) => {
    const Lockup = await setNetworkProvider();
    const res = await Lockup.methods.unClaimedReward(name).call({from: account});
    return res[1] ? res[0] : null;
}

export const getTotalStakedAmmount = async () => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.totalStaked().call() / Math.pow(10, 18);
}

export const getUserStakedInfo = async (account) => {
    const Lockup = await setNetworkProvider();
    Lockup.methods.getUserStakedInfo(account).call();
    const res = await Lockup.methods.getUserStakedInfo(account).call();
    let stakedInfo = [];
    _.each(res.info, item => {
        let tmp = {};
        tmp.duration = item.duration;
        tmp.amount = item.amount;
        tmp.stakedTime = item.stakedTime;
        tmp.lastClaimed = item.lastClaimed;
        tmp.name = item.name;
        tmp.NFTId = item.NFTId;
        tmp.StakeNFTId = item.NFTStakingId;
        stakedInfo.push(tmp)
    })
    return { length: res[0], stakedInfo, dailyRewards: res.dailyReward }
}

export const getTime = async () => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.getTime().call();
}

export const claim = async (nameList, account) => {
    const Lockup = await setNetworkProvider();
    await Lockup.methods.claimMulti(nameList).send({ from: account })
}

export const canWithdrawPrimaryToken = async(amount) => {
    const Lockup = setNetworkProvider();
    return await Lockup.methods.canWithdrawPrimaryToken(amount).call()
}

export const compound = async (nameList, account) => {
    const Lockup = await setNetworkProvider();
    await Lockup.methods.compoundMulti(nameList).send({ from: account })
}

export const withdraw = async (name, account) => {
    const Lockup = await setNetworkProvider();
    await Lockup.methods.unStake(name).send({ from: account })
}

// export const withdrawAll = async (account) => {
//     const Lockup = await setNetworkProvider();
//     Lockup.methods.unStakeAll().send({ from: account })
// }

export const isWidthdraw = async (name, account) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.isWithdrawable(name).call({ from: account });
}

export const isClaimable = async (name, account) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.isClaimable(name).call({ from: account });
}

export const getTokenURI = async (id) => {
    await setNetworkProvider();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, GuarantNFT);
    return await NFTContract.methods.tokenURI(id).call();
}

export const getUserNFT = async (address) => {
    await setNetworkProvider();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, CheemsXNFT);
    const tokenIds = await NFTContract.methods.getUserInfo(address).call();
    const tokenInfo = [];
    for (let i = 0; i < tokenIds.length; i++) {
        const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
        const tmp = {};
        _.set(tmp, "tokenId", tokenIds[i]);
        _.set(tmp, "uri", uri);
        tokenInfo.push(tmp)
    }
    return tokenInfo;
}

export const StakeNFT = async (address, name, tokenId) => {
    const LockupContract = setNetworkProvider();
    const NFTContract = new window.web3.eth.Contract(ERC721ABI, CheemsXNFT);
    await NFTContract.methods.approve(Lockup, tokenId).send({ from: address });
    await LockupContract.methods.stakeNFT(name, tokenId).send({ from: address })
}

export const UnStakeNFT = async (address, name) => {
    const Lockup = await setNetworkProvider();
    await Lockup.methods.unStakeNFT(name).send({ from: address })
}

export const getStakedTokenURI = async (id) => {
    const Lockup = await setNetworkProvider();
    const nftAddr = await Lockup.methods.StakeNFT().call();
    const NFTContract = await new window.web3.eth.Contract(ERC721ABI, nftAddr);
    return await NFTContract.methods.tokenURI(id).call();
}

export const isWhiteList = async (account) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.whiteList(account).call();
}

export const isBlackList = async (account) => {
    const Lockup = await setNetworkProvider();
    return await Lockup.methods.blackList(account).call();
}

export const getUserCheemsXInfo = async (account) => {
    const CheemsXToken = new window.web3.eth.Contract(ERC20ABI, CheemsX);
    const balance = await CheemsXToken.methods.balanceOf(account).call();
    const reflection = await CheemsXToken.methods.reflectionFromToken(balance, true).call();
    return { balance, reflection }
}

export const getMintStatistic = async(account) => {
    const callDataArray = [];
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'flatFee', // Name of the contract function to call
        // params: [] // Provide an array of args which map to arg0, arg1, argN
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'priceDivisor', // Name of the contract function to call
        // params: [] // Provide an array of args which map to arg0, arg1, argN
    });

    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'price',
            params: [i]
        })
    }
    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'max_Regular_tier',
            params: [i]
        })
    }
    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'maxWalletLimit',
            params: [i]
        })
    }
    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'getLen',
            params: [account, i]
        })
    }
    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'tBalance',
            params: [i]
        })
    }
    for(let i = 0; i <= 10; i++) {
        callDataArray.push({
            address: FractionalAddress,
            functionName: 'getInfo',
            params: [account, i]
        })
    }

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'currencyToken',
    })

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'getLen',
        params: [account, 10]
    })

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'maxTier0',
    })

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'maxTier0PerWallet',
    })

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'borrowFee',
    })

    callDataArray.push({
        address: FractionalAddress,
        functionName: 'getLen',
        params: [FractionalAddress, 10]
    })

    const returnedData = await multicall(
        RPC_URL,   // RPC url. ChainId is inferred from this to point to the proper contract
        FractionalABI,      // abi of contract that is being called
        callDataArray,  // Call[]
        {
            maxCallsPerTx: 1000, // This param defaults to 1000. It sets the max batch limit per multicall call,
            customMulticallAddress: MulticallAddress
        }                
    )
    const flatFee = returnedData[0][0].toString()
    const divisor = returnedData[1][0].toNumber()
    const maxRegular = [];
    const priceList = [];
    const maxWallet = [];
    const nftCounts = [];
    const userInfo = [];
    const tBalance = [];
    for(let i = 2; i < 13; i++) {
        priceList.push(returnedData[i][0].toNumber()/divisor)
        maxRegular.push(returnedData[i+11][0].toNumber())
        maxWallet.push(returnedData[i+22][0].toNumber())
        nftCounts.push(returnedData[i+33][0].toNumber())
        userInfo.push(returnedData[i+55])
        tBalance.push(returnedData[i+44][0].toNumber())
    }
    const currencyToken = returnedData[13+55][0].toString();
    const fractionlize = returnedData[13+56][0].toString();
    const maxTier0 = returnedData[13+57][0].toString();
    const maxTier0PerWallet = returnedData[13+58][0].toString();
    const borrowFee = returnedData[13+59][0].toNumber();
    const poolFraction = returnedData[13+60][0].toString();
    return {flatFee, divisor, maxRegular, priceList, maxWallet, nftCounts, userInfo, tBalance, currencyToken, fractionlize, maxTier0, maxTier0PerWallet, borrowFee, poolFraction}
}

export const getTokenName = async(address) => {
    const TokenContract = new window.web3.eth.Contract(ERC20ABI, address);
    return await TokenContract.methods.symbol().call();
}

export const getDefaultURL = async(tier) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    let uri = await FContract.methods.getMintUri(tier).call()
    return uri
}

export const mint = async(account, tier, amount, value, currency) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    if(currency.toLowerCase() !== AVAX.toLowerCase()) {
        const TokenContract = new window.web3.eth.Contract(ERC20ABI, currency);
        const decimal = await TokenContract.methods.decimals()
        await TokenContract.methods.approve(FContract, amount * 10 ** decimal).send({ from: account });
    }
    await FContract.methods.mintNFTWithAvax(account, tier, amount).send({from: account, value: Web3.utils.toWei(value, "ether")})
}

export const canMint = async(tier, amount, price, flatFee, account) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const currencyToken = await FContract.methods.currencyToken().call();
    if(currencyToken.toLowerCase() === AVAX.toLowerCase()) {
        const totalAmount = (price * amount + flatFee) * 10 ** 18
        const bal = await window.web3.eth.getBalance(account)
        console.log(bal, totalAmount)
        if(bal < totalAmount) return {insufficient: true};
    } else {
        const tokenContract = setNetworkProvider(ERC20ABI, currencyToken)
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        if(tokenBalance < (price * amount) * 10 ** 18) return {insufficient: true};
        const bal = await window.web3.eth.getBalance(account)
        if(bal < flatFee) return {insufficient: true};
    }
    const limitMint = await FContract.methods.canMint(tier, amount).call()
    return {limitMint: !limitMint}
}

export const canUpgrade = async(price, account, tier) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const upgradable = await FContract.methods.upgradable().call();
    if(upgradable === false) return {noUpgradable: true};
    const bal = await window.web3.eth.getBalance(account)
    if(price > Number(bal) / 10 ** 18) return {insufficient: true}
    const limitMint = await FContract.methods.canMint(tier, 1).call()
    return {mintlimit: !limitMint}
}

export const canFraction = async(fractionAmount, account, flatFee) => {
    const bal = await window.web3.eth.getBalance(account)
    if(flatFee > Number(bal) / 10 ** 18) {
        return {insufficient: true}
    }
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const limitMint = await FContract.methods.canMint(10, fractionAmount).call()
    if(limitMint === false) return {mintlimit: true}
    const cantransfer = await FContract.methods.canTransfer(account, 0, fractionAmount).call()
    if(!cantransfer) return {fractionLimit: true}
}

export const canDowngrade = async(mintAmount, account, flatFee) => {
    const bal = await window.web3.eth.getBalance(account)
    if(flatFee > Number(bal) / 10 ** 18) return {insufficient: true}
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const upgradable = await FContract.methods.upgradable().call();
    if(upgradable === false) return {noUpgradable: true};
    const limitMint = await FContract.methods.canMint(10, mintAmount).call()
    if(limitMint === false) return {mintlimit: true}
    let cantransfer = await FContract.methods.canTransfer(account, 0, mintAmount).call()
    if(!cantransfer) return {fractionLimit: true}
}

export const canTransfer = async(address, tokenId, amount) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    return await FContract.methods.canTransfer(address, tokenId, amount).call()
}

export const canUpdateURI = async(account, flatFee) => {
    const bal = await window.web3.eth.getBalance(account)
    if(flatFee > Number(bal) / 10 ** 18) return {insufficient: true}
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const ableUpdateURI = await FContract.methods.ableUpdateURI().call()
    if(!ableUpdateURI) return {ableUpdateURI: true}
}

export const canBorrow = async(amount, flatFee, account) => {
    const bal = await window.web3.eth.getBalance(account)
    if(flatFee > Number(bal) / 10 ** 18) return {insufficient: true}
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const borrowable = await FContract.methods.isBorrowable().call();
    if(!borrowable) return {noborrowable : true}
    const cantransfer = await FContract.methods.canTransfer(account, 0, amount).call()
    if(!cantransfer) return {fractionLimit: true}
}

export const canRedeem = async(flatFee, account) => {
    const bal = await window.web3.eth.getBalance(account)
    if(flatFee > Number(bal) / 10 ** 18) return {insufficient: true}
}

export const canDoRoyalty = async(currency, royaltiFee, price, account) => {
    const amount = royaltiFee * price * 10**18 /10;
    const tokenContract = setNetworkProvider(ERC20ABI, currency)
    const balance = await tokenContract.methods.balanceOf(account).call()
    if(amount > Number(balance)) return false;
    return true;
}

export const transferNFT = async(from, to, amount) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    return await FContract.methods.tier0transfer(to, amount).send({from})
}

export const getExchangeTokenAmount = async(account) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    const XYZAddress = await FContract.methods.XYZToken().call()
    const TokenContract = setNetworkProvider(ERC20ABI, XYZAddress);
    return await TokenContract.methods.balanceOf(account).call() / 10**18;
}

export const swap = async(amount, isBuy, flatFee, account) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    amount = Number(amount).toFixed(0);
    if(isBuy) {
        const XYZAddress = await FContract.methods.XYZToken().call()
        const TokenContract = setNetworkProvider(ERC20ABI, XYZAddress);
        await TokenContract.methods.approve(FractionalAddress, Web3.utils.toWei(amount, "ether")).send({from: account})
    }
    await FContract.methods.exchangeXYZAndTier0(amount, isBuy).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const getTierInfo = async(tokenId) => {
    // const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    // return await FContract.methods.tierInfo(tokenId).call()

    const callDataArray = [];
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'tierInfo', // Name of the contract function to call
        params: [tokenId] // Provide an array of args which map to arg0, arg1, argN
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'royaltyList', // Name of the contract function to call
        params: [tokenId] // Provide an array of args which map to arg0, arg1, argN
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'roayltyFee', // Name of the contract function to call
    });

    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'tokenURI', // Name of the contract function to call
        params: [tokenId]
    });

    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'royaltyOption', // Name of the contract function to call
    });

    const returnedData = await multicall(
        RPC_URL,   // RPC url. ChainId is inferred from this to point to the proper contract
        FractionalABI,      // abi of contract that is being called
        callDataArray,  // Call[]
        {
            maxCallsPerTx: 1000, // This param defaults to 1000. It sets the max batch limit per multicall call,
            customMulticallAddress: MulticallAddress
        }                
    )
    const tierInfo = returnedData[0][0].toNumber()
    const royalty = returnedData[1]
    const royaltiFee = returnedData[2][0].toNumber()
    const tokenUri = returnedData[3][0]
    const royaltyOption = returnedData[4][0]
    // const royaltiFee = 2
    return {tierInfo, royalty, royaltiFee, tokenUri, royaltyOption}
}

export const updateNFT = async(tokenId, tierId, account,flatFee, currency, royaltiFee) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    // await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.upgradeNFT(tokenId, tierId).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

const approveToRoyalty = async(currency, royaltiFee, account) => {
    const TokenContract = setNetworkProvider(ERC20ABI, currency);
    const decimal = await TokenContract.methods.decimals().call();
    const amount = converNumber2Str(royaltiFee, decimal);
    console.log(amount)
    await TokenContract.methods.approve(FractionalAddress, converNumber2Str(royaltiFee, decimal)).send({from: account})
}

export const downgradeNFT = async(tokenId, tierId, account,flatFee,currency, royaltiFee) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    // await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.downgradeNFT(tokenId, tierId).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const fractionlize = async (tokenId, account,flatFee,currency, royaltiFee) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    // await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.fractionalize(tokenId).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const updateURI = async (tokenId, uri, account,flatFee,currency, royaltiFee) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    await FContract.methods.updateURI(tokenId, uri).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const aggrigate = async(amount, tierId, account,flatFee,currency, royaltiFee) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    // await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.aggregation(amount, tierId).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const borrow = async(tokenId, account,flatFee,currency, royaltiFee, royaltiOption) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    if(royaltiOption !== 0) await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.borrow(tokenId).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const redeem = async(tokenId, account,flatFee,currency, royaltiFee, royaltiOption) => {
    const FContract = setNetworkProvider(FractionalABI, FractionalAddress);
    if(royaltiOption !== 0) await approveToRoyalty(currency, royaltiFee, account)
    await FContract.methods.redeemNFT(tokenId, false).send({from: account, value: Web3.utils.toWei(flatFee, "ether")})
}

export const borrowInfo = async() => {
    const callDataArray = [];
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'borrowFee', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'redeemFee', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'graceFee', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'discountFee', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'holdPeriod', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'gracePeriod', // Name of the contract function to call
    });
    callDataArray.push({
        address: FractionalAddress,          // Address of the contract to call
        functionName: 'getBorrowInfo', // Name of the contract function to call
    });

    const returnedData = await multicall(
        RPC_URL,   // RPC url. ChainId is inferred from this to point to the proper contract
        FractionalABI,      // abi of contract that is being called
        callDataArray,  // Call[]
        {
            maxCallsPerTx: 1000, // This param defaults to 1000. It sets the max batch limit per multicall call,
            customMulticallAddress: MulticallAddress
        }                
    )

    const borrowFee = returnedData[0][0].toNumber()
    const redeemFee = returnedData[1][0].toNumber()
    const graceFee = returnedData[2][0].toNumber()
    const discountFee = returnedData[3][0].toNumber()
    const holdPeriod = returnedData[4][0].toNumber()
    const gracePeriod = returnedData[5][0].toNumber()
    const getBorrowInfo = returnedData[6]
    return {borrowFee, redeemFee, graceFee, discountFee, holdPeriod, gracePeriod, getBorrowInfo}
}
