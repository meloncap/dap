import React,{ useEffect, useState } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { RPC_URL, ChainId } from '../utils/constant';

export const FTM_MAIN_ID = 250;
export const KOVAN_TEST_ID = 42;

const defaultVal = {
  account: "",
  login: async()=>{},
  logout: () => {},
  provider: {}
}

export const UserAuthContext = React.createContext(defaultVal)

export default function useAuth() {
  return React.useContext(UserAuthContext);
}

export function UserAuthProvider({ children }) {
  const [web3Modal, setWeb3Modal] = useState()
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState({})

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('networkChanged', () => {
        const metamaskId = window.ethereum.chainId;
        if(parseInt(metamaskId, 16) !== ChainId) {
          logout();
        } else {
          login()
        }
      })
      window.ethereum.on('connect', (connectInfo) => {
        if(parseInt(connectInfo.chainId, 16) === ChainId) {
          login()
        }
      })
    }
    // eslint-disable-next-line
  }, [window.ethereum])

  const login = async () => {
    const metamaskId = window.ethereum.chainId;
    if(parseInt(metamaskId, 16) !== ChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(ChainId) }]
        });
      } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: Web3.utils.toHex(ChainId),
              }
            ]
          });
        }
      } 
    }
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            43113: RPC_URL
          },
          chainId: ChainId
        }
      }
    }
    
    const web3Modal = new Web3Modal({
      network: "mainnet", 
      cacheProvider: true, 
      providerOptions 
    });
    // web3Modal.clearCachedProvider();
    const provider = await web3Modal.connect();
    await web3Modal.toggleModal();
    const newWeb3 = new Web3(provider);
    if (window.ethereum) {
      window.web3 = newWeb3;
    }
    const accounts = await newWeb3.eth.getAccounts();
    setAccount(accounts[0])
    setWeb3Modal(web3Modal)
    setProvider(newWeb3)
    return accounts[0];
  }

  const logout = async() => {
    setAccount("")
    if (window.ethereum) {
      delete window.web3;
    }
    if(!web3Modal) return;
    web3Modal.clearCachedProvider()
  }

  return <UserAuthContext.Provider value={{account, login, logout, provider}} children={children}  />;
}