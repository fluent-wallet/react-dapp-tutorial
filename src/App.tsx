import './App.css'
import { useState, useEffect } from 'react'
import { formatBalance, formatChainAsNum } from './utils'
import detectProvider from '@fluent-wallet/detect-provider'

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)

  const [isConnecting, setIsConnecting] = useState(false)  
  const [error, setError] = useState(false)                
  const [errorMessage, setErrorMessage] = useState("")    

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }))
    }

    const getProvider = async () => {
      const provider = await detectProvider({
        injectFlag: "conflux",
        defaultWalletFlag: "isFluent",
      })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await window.conflux.request(
          { method: 'cfx_accounts' }
        )
        refreshAccounts(accounts)
        window.conflux.on('accountsChanged', refreshAccounts)
        window.conflux.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    return () => {
      window.conflux?.removeListener('accountsChanged', refreshAccounts)
      window.conflux?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(await window.conflux!.request({
      method: "cfx_getBalance",
      params: [accounts[0]],
    }))
    const chainId = await window.conflux!.request({
      method: "cfx_chainId",
    })
    setWallet({ accounts, balance, chainId })
  }

  const handleConnect = async () => {                  
    setIsConnecting(true)                              
    await window.conflux.request({                    
      method: "cfx_requestAccounts",
    })
    .then((accounts:[]) => {                            
      setError(false)                                  
      updateWallet(accounts)                           
    })                                                 
    .catch((err:any) => {                               
      setError(true)                                   
      setErrorMessage(err.message)                     
    })                                                  
    setIsConnecting(false)                             
  }

  const disableConnect = Boolean(wallet) && isConnecting

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

      {window.conflux?.isFluent && wallet.accounts.length < 1 &&
                /* Updated */
        <button disabled={disableConnect} onClick={handleConnect}>Connect Fluent</button>
      }

      {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
      }
      { error && (                                       
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )
      }
    </div>
  )
}

export default App