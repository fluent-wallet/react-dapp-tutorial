import { useFluent } from '~/hooks/useFluent'
import { formatAddress } from '~/utils'
import styles from './Navigation.module.css'

export const Navigation = () => {

  const { wallet, hasProvider, isConnecting, connectFluent } = useFluent()

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <div className={styles.leftNav}>Vite + React & Fluent</div>
        <div className={styles.rightNav}>
          {!hasProvider &&
            <a href="https://fluent.wallet" target="_blank" rel="noreferrer">
              Install Fluent
            </a>
          }
          {window.conflux?.isFluent && wallet.accounts.length < 1 &&
            <button disabled={isConnecting} onClick={connectFluent}>
              Connect Fluent
            </button>
          }
          {hasProvider && wallet.accounts.length > 0 &&
            <a
              className="text_link tooltip-bottom"
              href={`https://confluxscan.io/address/${wallet}`}
              target="_blank"
              data-tooltip= "Open in Block Explorer" rel="noreferrer"
            >
              {formatAddress(wallet.accounts[0])}
            </a>
          }
        </div>
      </div>
    </div>
  )
}