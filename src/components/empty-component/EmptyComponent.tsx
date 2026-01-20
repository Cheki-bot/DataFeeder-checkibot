import { LeftArrowIcon } from '@/assets/svg/icons/left-arrow-icon';
import styles from './EmptyComponent.module.css';

export const EmptyComponent = () => {
    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.title}>Categoria no seleccionada</h2>
                <LeftArrowIcon className={styles.icon} />
                <div className={styles.content}>
                    <p>Selecciona uno en el menu izquierdo</p>
                </div>
            </div>
        </>
    );
};
