import {
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
} from '@components/index';
import styles from './VerificationCreateView.module.css';

export const VerificationCreateView = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Añadir Verificación</h2>
                </div>
                <section className={styles.form}>
                    <InputComponent label="Título" type="text" />
                    <InputComponent label="Resumen" type="text" />
                    <InputComponent label="Cuerpo" type="text" />
                    <InputComponent label="Clasificación" type="text" />
                    <InputComponent label="URL" type="text" />
                    <InputComponent label="Fecha de Publicación" type="date" />
                    <TagsInputComponent />
                    <ButtonComponent
                        label="Crear Verificación"
                        onClick={() => {}}
                    />
                </section>
            </div>
        </div>
    );
};
