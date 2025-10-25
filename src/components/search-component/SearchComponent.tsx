import { InputComponent } from '../input-component/InputComponent';
import styles from './SearchComponent.module.css';

export const SearchComponent = () => {
  return (
    <article className={styles.searchComponent}>
        <InputComponent label='' type='text' placeholder='Search...' />
    </article>
  )
}