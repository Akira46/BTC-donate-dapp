import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WalletConnectProvider } from '@btc-vision/walletconnect'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletConnectProvider network="testnet" theme="dark">
      <App />
    </WalletConnectProvider>
  </React.StrictMode>,
)
