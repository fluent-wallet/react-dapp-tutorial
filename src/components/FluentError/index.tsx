import { useFluent } from '~/hooks/useFluent'
import styles from './FluentError.module.css'

export const FluentError = () => {
  const { error, errorMessage, clearError } = useFluent()
  return (
    <div className={styles.FluentError} style={
      error ? { backgroundColor: 'brown' } : {}
    }>
      { error && (
        <div onClick={clearError}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )
      }
    </div>
  )
}