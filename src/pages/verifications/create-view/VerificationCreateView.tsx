import {
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
} from '@components';
import styles from './VerificationCreateView.module.css';

export const VerificationCreateView = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Añadir Verificación</h2>
                </div>
                <section className={styles.form}>
                    <InputComponent
                        label="Título"
                        type="text"
                        placeholder="Agrega el título de la verificación"
                    />
                    <InputComponent
                        label="Resumen"
                        type="text"
                        placeholder="Agrega el resumen de la verificación"
                    />
                    <InputComponent
                        label="Cuerpo"
                        type="text"
                        placeholder="Agrega el cuerpo de la verificación"
                    />
                    <InputComponent
                        label="Clasificación"
                        type="text"
                        placeholder="Agrega la clasificación de la verificación"
                    />
                    <InputComponent
                        label="URL"
                        type="text"
                        placeholder="Agrega la URL de la verificación"
                    />
                    <InputComponent
                        label="Fecha de Publicación"
                        type="text"
                        placeholder="mm/dd/aaaa"
                    />
                    <TagsInputComponent placeholder="Agrega etiquetas relacionadas" />
                    <ButtonComponent
                        label="Crear Verificación"
                        onClick={() => {}}
                    />
                </section>
            </div>
        </div>
    );
};
