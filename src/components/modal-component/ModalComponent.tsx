import { ButtonComponent } from '../button-component/ButtonComponent';
import styles from './ModalComponent.module.css';

interface ModalProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose: () => void;
    Accept: () => void;
}

export const ModalComponent = ({
    children,
    isOpen,
    onClose,
    Accept,
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-modal
            onClick={
                onClose ||
                (() => {
                    isOpen = false;
                })
            }
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={
                        onClose ||
                        (() => {
                            isOpen = false;
                        })
                    }
                >
                    x
                </button>
                {children}
                <ButtonComponent label="Accept" onClick={Accept} />
            </div>
        </div>
    );
};
