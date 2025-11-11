import { NotificationComponent } from '../notification-component/NotificationComponent';
import styles from './NotificationContainer.module.css';

interface Notification {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface NotificationContainerProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

export const NotificationContainer = ({
    notifications,
    onClose,
}: NotificationContainerProps) => {
    return (
        <div className={styles.container}>
            {notifications.map((notification) => (
                <NotificationComponent
                    key={notification.id}
                    id={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};
