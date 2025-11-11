import { ButtonComponent } from '../button-component/ButtonComponent';
import styles from './ModalComponent.module.css';

interface ModalProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
    Accept: () => void;
    acceptLabel?: string;
    isLoading?: boolean;
}

export const ModalComponent = ({
    children,
    isOpen,
    onClose,
    Accept,
    acceptLabel = 'Accept',
    isLoading = false,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    ×
                </button>
                {children}
                <ButtonComponent 
                    label={isLoading ? 'Guardando...' : acceptLabel} 
                    onClick={Accept}
                />
            </div>
        </div>
    );
};
