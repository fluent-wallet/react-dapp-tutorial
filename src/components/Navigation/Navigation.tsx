import styles from './Navigation.module.css'

export const Navigation = () => {

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <div className={styles.leftNav}>Vite + React & Fluent</div>
        <div className={styles.rightNav}>
          Connect Fluent
        </div>
      </div>
    </div>
  )
}