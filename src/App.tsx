import { useState, useEffect } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import './App.css';

interface Donation {
  id: number;
  name: string;
  amount: number;
  message: string;
  timestamp: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// Donation Address (Using the same dummy one, or a real testnet one if provided)
const DONATION_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'; // Ideally replace with a p2tr address on Signet/Testnet

function App() {
  const { 
    walletAddress, 
    openConnectModal, 
    disconnect, 
    walletInstance,
    network
  } = useWalletConnect();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'signing' | 'broadcasting' | 'success' | 'failed'>('idle');
  const [error, setError] = useState('');

  // Load local history
  useEffect(() => {
    const stored = localStorage.getItem('opnet_donations_v1');
    if (stored) {
      setDonations(JSON.parse(stored));
    }
  }, []);

  const saveDonations = (newDonations: Donation[]) => {
    localStorage.setItem('opnet_donations_v1', JSON.stringify(newDonations));
    setDonations(newDonations);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletInstance) {
        setStatus('failed');
        setError("Wallet not connected");
        return;
    }

    try {
        setStatus('signing');
        const satoshis = Math.floor(parseFloat(amount) * 100_000_000);
        
        // This is a simplified call. Real implementation depends on the wallet API exposed by walletInstance.
        // Assuming walletInstance aligns with Unisat/OP_WALLET standard interface
        // sendBitcoin(toAddress, satoshis, options)
        const txHash = await walletInstance.sendBitcoin(DONATION_ADDRESS, satoshis);

        setStatus('success');
        
        const newDonation: Donation = {
            id: Date.now(),
            name: name || 'Anonymous',
            amount: parseFloat(amount),
            message,
            timestamp: new Date().toISOString(),
            txHash,
            status: 'pending' // In reality, we'd poll for confirmation
        };

        saveDonations([newDonation, ...donations]);
        
        setTimeout(() => {
            setModalOpen(false);
            setStatus('idle');
            setAmount('');
            setMessage('');
            setName('');
        }, 3000);

    } catch (err: any) {
        console.error(err);
        setStatus('failed');
        setError(err.message || "Transaction failed");
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + (d.status !== 'failed' ? d.amount : 0), 0);

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">OP_NET</div>
        <div className="nav-actions">
            {walletAddress ? (
                <div className="wallet-chip">
                    <div className="wallet-status-dot"></div>
                    <span className="address">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
                    <button onClick={disconnect} className="btn-disconnect" title="Disconnect">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            ) : (
                <button onClick={openConnectModal} className="btn-connect">Connect Wallet</button>
            )}
        </div>
      </nav>

      <div className="container">
        <header className="hero">
            <div className="hero-pill">OP_NET ECOSYSTEM</div>
            <h1 className="hero-title">Donations</h1>
            <p className="hero-subtitle">Support the decentralized future on Bitcoin.</p>
        </header>

        <div className="stats-card">
            <div className="total-label">Total Raised</div>
            <div className="total-amount">{totalDonated.toFixed(8)} BTC</div>
            
            {walletAddress ? (
                <button className="btn-donate" onClick={() => setModalOpen(true)}>Donate Now</button>
            ) : (
                <button className="btn-donate disabled" disabled>Connect Wallet to Donate</button>
            )}
        </div>

        <div className="donors-section">
            <h3>Recent Transactions</h3>
            <div className="donor-list">
                {donations.length === 0 ? (
                    <div className="empty-state">No donations yet on this device.</div>
                ) : (
                    donations.map(d => (
                        <div key={d.id} className="donor-card">
                            <div className="donor-header">
                                <span className="donor-name">{d.name}</span>
                                <span className="donor-amount">+{d.amount} BTC</span>
                            </div>
                            {d.message && <div className="donor-message">"{d.message}"</div>}
                            <div className="donor-meta">
                                <span>{new Date(d.timestamp).toLocaleTimeString()}</span>
                                {d.txHash && <a href={`https://testnet.opnet.org/tx/${d.txHash}`} target="_blank" rel="noreferrer" className="tx-link">View TX</a>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Make a Donation</h2>
                <form onSubmit={handleDonate}>
                    <div className="form-group">
                        <label>Amount (BTC)</label>
                        <input 
                            type="number" 
                            step="0.00000001" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            required 
                            placeholder="0.001"
                        />
                    </div>
                    <div className="form-group">
                        <label>Name (Optional)</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Anonymous"
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea 
                            value={message} 
                            onChange={e => setMessage(e.target.value)} 
                            placeholder="Cheering you on!"
                        />
                    </div>

                    {status === 'failed' && <div className="error-msg">{error}</div>}
                    {status === 'success' && <div className="success-msg">Transaction Sent!</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
                        <button 
                            type="submit" 
                            className="btn-submit" 
                            disabled={status === 'signing' || status === 'broadcasting' || status === 'success'}
                        >
                            {status === 'signing' ? 'Check Wallet...' : status === 'success' ? 'Sent!' : 'Confirm Donation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
