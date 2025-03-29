import { ethers } from "ethers"

// RPC URL for Sepolia testnet
export const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/8S8UAP8uUpcHVwOF7WJN-3l9apQBqZJB"

// Create a provider
export const getProvider = () => {
  return new ethers.JsonRpcProvider(RPC_URL)
}

// Generate a random mnemonic
export const generateMnemonic = () => {
  return ethers.Wallet.createRandom().mnemonic?.phrase
}

// Create a wallet from a mnemonic
export const createWalletFromMnemonic = (mnemonic: string) => {
  return ethers.Wallet.fromPhrase(mnemonic)
}

// Create a random wallet
export const createRandomWallet = () => {
  return ethers.Wallet.createRandom()
}

// Get address from private key
export const getAddressFromPrivateKey = (privateKey: string) => {
  return new ethers.Wallet(privateKey).address
}

// Get native token (ETH) balance
export const getNativeBalance = async (address: string) => {
  const provider = getProvider()
  const balance = await provider.getBalance(address)
  return ethers.formatEther(balance)
}

// Get ERC20 token balance
export const getTokenBalance = async (tokenAddress: string, walletAddress: string) => {
  const provider = getProvider()

  // ERC20 token ABI (minimal for balanceOf function)
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ]

  const tokenContract = new ethers.Contract(tokenAddress, abi, provider)

  try {
    const balance = await tokenContract.balanceOf(walletAddress)
    const decimals = await tokenContract.decimals()
    const symbol = await tokenContract.symbol()

    return {
      balance: ethers.formatUnits(balance, decimals),
      symbol,
    }
  } catch (error) {
    console.error("Error getting token balance:", error)
    throw error
  }
}

// Get token info
export const getTokenInfo = async (tokenAddress: string) => {
  const provider = getProvider()

  // ERC20 token ABI
  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
  ]

  const tokenContract = new ethers.Contract(tokenAddress, abi, provider)

  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply(),
    ])

    return {
      name,
      symbol,
      decimals,
      totalSupply: ethers.formatUnits(totalSupply, decimals),
    }
  } catch (error) {
    console.error("Error getting token info:", error)
    throw error
  }
}

// Transfer ETH
export const transferEth = async (privateKey: string, toAddress: string, amount: string) => {
  const provider = getProvider()
  const wallet = new ethers.Wallet(privateKey, provider)

  const tx = {
    to: toAddress,
    value: ethers.parseEther(amount),
  }

  try {
    const transaction = await wallet.sendTransaction(tx)
    return transaction
  } catch (error) {
    console.error("Error transferring ETH:", error)
    throw error
  }
}

// Transfer ERC20 token
export const transferToken = async (privateKey: string, tokenAddress: string, toAddress: string, amount: string) => {
  const provider = getProvider()
  const wallet = new ethers.Wallet(privateKey, provider)

  // ERC20 token ABI (minimal for transfer function)
  const abi = ["function transfer(address to, uint amount) returns (bool)", "function decimals() view returns (uint8)"]

  const tokenContract = new ethers.Contract(tokenAddress, abi, provider)
  const contractWithSigner = tokenContract.connect(wallet)

  try {
    const decimals = await tokenContract.decimals()
    const parsedAmount = ethers.parseUnits(amount, decimals)

    const transaction = await contractWithSigner.transfer(toAddress, parsedAmount)
    return transaction
  } catch (error) {
    console.error("Error transferring token:", error)
    throw error
  }
}

// Get transaction details
export const getTransaction = async (txHash: string) => {
  const provider = getProvider()

  try {
    const tx = await provider.getTransaction(txHash)
    const receipt = await provider.getTransactionReceipt(txHash)

    return {
      hash: tx?.hash,
      from: tx?.from,
      to: tx?.to,
      value: tx?.value ? ethers.formatEther(tx.value) : "0",
      gasPrice: tx?.gasPrice ? ethers.formatUnits(tx.gasPrice, "gwei") : "0",
      gasLimit: tx?.gasLimit?.toString(),
      nonce: tx?.nonce,
      status: receipt?.status === 1 ? "Success" : "Failed",
      blockNumber: receipt?.blockNumber,
      confirmations: tx?.confirmations,
    }
  } catch (error) {
    console.error("Error getting transaction:", error)
    throw error
  }
}

