import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WalletConnectProvider } from '@btc-vision/walletconnect'
import { networks } from '@btc-vision/bitcoin'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletConnectProvider network={networks.opnetTestnet} theme="dark">
      <App />
    </WalletConnectProvider>
  </React.StrictMode>,
)
