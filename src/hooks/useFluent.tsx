/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback } from 'react'

import detectProvider from '@fluent-wallet/detect-provider'
import { formatBalance } from '~/utils'

interface WalletState {
  accounts: any[]
  balance: string
  chainId: string
}

interface FluentContextData {
  wallet: WalletState
  hasProvider: boolean | null
  error: boolean
  errorMessage: string
  isConnecting: boolean
  connectFluent: () => void
  clearError: () => void
}

const disconnectedState: WalletState = { accounts: [], balance: '', chainId: '' }

const FluentContext = createContext<FluentContextData>({} as FluentContextData)

export const FluentContextProvider = ({ children }: PropsWithChildren) => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)

  const [isConnecting, setIsConnecting] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => setErrorMessage('')

  const [wallet, setWallet] = useState(disconnectedState)
  // useCallback ensures that you don't uselessly recreate the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts = providedAccounts || await window.ethereum.request(
      { method: 'eth_accounts' },
    )

    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState)
      return
    }

    const balance = formatBalance(await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0]],
    }))
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })

    setWallet({ accounts, balance, chainId })
  }, [])

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet])
  const updateWallet = useCallback((accounts: any) => _updateWallet(accounts), [_updateWallet])

  /**
   * This logic checks if Fluent is installed. If it is, some event handlers are set up
   * to update the wallet state when Fluent changes. The function returned by useEffect
   * is used as a "cleanup": it removes the event handlers whenever the FluentProvider
   * is unmounted.
   */
  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectProvider({
        injectFlag: 'ethereum',
        defaultWalletFlag: 'isFluent',
      })
      setHasProvider(Boolean(provider))

      if (provider) {
        updateWalletAndAccounts()
        window.ethereum.on('accountsChanged', updateWallet)
        window.ethereum.on('chainChanged', updateWalletAndAccounts)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet)
      window.ethereum?.removeListener('chainChanged', updateWalletAndAccounts)
    }
  }, [updateWallet, updateWalletAndAccounts])

  const connectFluent = async () => {
    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      clearError()
      updateWallet(accounts)
    } catch(err: any) {
      setErrorMessage(err.message)
    }
    setIsConnecting(false)
  }

  return (
    <FluentContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectFluent,
        clearError,
      }}
    >
      {children}
    </FluentContext.Provider>
  )
}

export const useFluent = () => {
  const context = useContext(FluentContext)
  if (context === undefined) {
    throw new Error('useFluent must be used within a "FluentContextProvider"')
  }
  return context
}