import styles from './SearchComponent.module.css';

export const SearchComponent = () => {
  return (
    <article className={styles.searchComponent}>
        <input className={styles.input} type="text" placeholder="Search..." />
    </article>
  )
}