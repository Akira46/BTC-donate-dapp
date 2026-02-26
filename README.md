# OP_NET Bitcoin Donation dApp

A decentralized application (dApp) built on the OP_NET Bitcoin smart contract protocol. This dApp allows users to connect their Bitcoin wallets (Unisat, OP_WALLET) and make on-chain donations to a specific address on the Bitcoin Signet/Testnet.

![Screenshot Placeholder](https://via.placeholder.com/800x400?text=OP_NET+Donation+dApp)

## Features

-   **Wallet Connection**: Seamless integration with `@btc-vision/walletconnect` (Supports Unisat, Xverse, OP_WALLET).
-   **On-Chain Transactions**: Sends real Bitcoin transactions on Signet/Testnet.
-   **Transaction History**: Local persistence of donation history.
-   **Responsive UI**: Premium, dark-mode fintech design.

## Prerequisites

-   **Node.js**: v18 or higher.
-   **Bitcoin Wallet**: Unisat or OP_WALLET browser extension.
-   **Network**: Must be set to **Bitcoin Signet** or **OP_NET Testnet**.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/btc-donate-dapp.git
    cd btc-donate-dapp
    ```

2.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Configure Donation Address:**
    Open `src/App.tsx` and find the `DONATION_ADDRESS` constant. Replace it with your own Bitcoin address (P2TR recommended).
    ```typescript
    const DONATION_ADDRESS = 'your-bitcoin-address-here';
    ```

4.  **Run the dApp:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173`.

## Security & Disclaimer

-   **No Private Keys**: This frontend dApp **never** asks for or stores your private keys. All signing happens securely within your browser wallet extension.
-   **Testnet Only**: By default, this is configured for Testnet/Signet. Do not use mainnet real funds without verifying the network configuration.
-   **Open Source**: Verify the code yourself before interacting.

## License

MIT License.
