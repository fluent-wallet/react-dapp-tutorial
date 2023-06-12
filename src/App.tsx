import './App.global.css'
import styles from './App.module.css'

import { Navigation } from './components/Navigation'
import { Display } from './components/Display'
import { FluentError } from './components/FluentError'
import { FluentContextProvider } from './hooks/useFluent'

export const App = () => {

  return (
    <FluentContextProvider>
      <div className={styles.appContainer}>
        <Navigation />
        <Display />
        <FluentError />
      </div>
    </FluentContextProvider>
  )
}