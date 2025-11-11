import { useEffect } from 'react';
import type { NotificationType } from '@/interfaces/Notification';
import styles from './NotificationComponent.module.css';

interface NotificationComponentProps {
    id: string;
    message: string;
    type?: NotificationType;
    duration?: number;
    onClose: (id: string) => void;
}

const iconPaths: Record<NotificationType, string> = {
    success: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
    error: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
};

export const NotificationComponent = ({
    id,
    message,
    type = 'info',
    duration = 3000,
    onClose,
}: NotificationComponentProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`${styles.notification} ${styles[type]}`}>
            <div className={styles.icon}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d={iconPaths[type]} fill="currentColor" />
                </svg>
            </div>
            <p className={styles.message}>{message}</p>
            <button
                className={styles.closeButton}
                onClick={() => onClose(id)}
                aria-label="Cerrar notificación"
            >
                ×
            </button>
        </div>
    );
};
