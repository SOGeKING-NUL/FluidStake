import React, { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('1000000000000000000');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const AAVE_POOL_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Sepolia Aave Pool
  const WETH_ADDRESS = "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c"; // Sepolia WETH

  const connectWallet = async () => {
    setError('');
    setLoading(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setUserAddress(accounts[0]);
      } else {
        throw new Error("Please install MetaMask!");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveWETH = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount in wei.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const wethContractAbi = [
        {
          "constant": false,
          "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
          ],
          "name": "approve",
          "outputs": [{ "name": "", "type": "bool" }],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const wethContract = new web3.eth.Contract(wethContractAbi, WETH_ADDRESS);

      const tx = await wethContract.methods.approve(AAVE_POOL_ADDRESS, amount).send({
        from: userAddress
      });

      // Show success message
      setError(`Success! Transaction hash: ${tx.transactionHash}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center">
              WETH Approval for Aave
            </h1>

            {!userAddress ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Wallet className="w-5 h-5" />
                )}
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Connected Address</p>
                  <p className="font-mono text-sm truncate">{userAddress}</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium">
                    Amount (in wei)
                  </label>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000000000000000000"
                  />
                </div>

                <button
                  onClick={approveWETH}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Approve WETH
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm break-all">
                  {error.includes("Success!") ? (
                    <span className="text-green-400">{error}</span>
                  ) : (
                    <span className="text-red-400">{error}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;