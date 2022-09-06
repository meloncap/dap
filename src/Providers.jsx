import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from './utils/web3React'
import { UserAuthProvider } from './hooks/useAuth'
import { TransactionHandleProvider } from './hooks/useTransaction'
import { MoralisProvider } from "react-moralis"

const Providers = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MoralisProvider appId="urczKdxO9V9rvXbk41WPEOxdiXsg1DZBQbIBoOn6" serverUrl="https://f958o47s7uif.usemoralis.com:2053/server">
        <TransactionHandleProvider>
          <UserAuthProvider>
            {children}
          </UserAuthProvider>
        </TransactionHandleProvider>
      </MoralisProvider>
    </Web3ReactProvider>
  )
}

export default Providers
