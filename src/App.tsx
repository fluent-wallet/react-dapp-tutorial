import './App.css'
import { useState, useEffect } from 'react'
import detectProvider from '@fluent-wallet/detect-provider'

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [] }
  const [wallet, setWallet] = useState(initialState)

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {                
      if (accounts.length > 0) {                                
        updateWallet(accounts)                                 
      } else {                                                  
        // if length 0, user is disconnected                    
        setWallet(initialState)                                
      }                                                         
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
      }                                                         
    }

    getProvider()
    return () => {                                              
      window.conflux?.removeListener('accountsChanged', refreshAccounts)
    }                                                           
  }, [])

  const updateWallet = async (accounts:any) => {
    setWallet({ accounts })
  }

  const handleConnect = async () => {
    let accounts = await window.conflux.request({
      method: "cfx_requestAccounts",
    })
    updateWallet(accounts)
  }

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

      { window.conflux?.isFluent && wallet.accounts.length < 1 &&  /* Updated */
        <button onClick={handleConnect}>Connect Fluent</button>
      }

      { wallet.accounts.length > 0 &&
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
      }
    </div>
  )
}

export default App