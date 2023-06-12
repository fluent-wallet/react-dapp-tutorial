import './App.global.css'
import styles from './App.module.css'

import { Navigation } from './components/Navigation'
import { Display } from './components/Display'
import { FluentError } from './components/FluentError'

export const App = () => {

  return (
    <div className={styles.appContainer}>
      <Navigation />
      <Display />
      <FluentError />
    </div>
  )
}