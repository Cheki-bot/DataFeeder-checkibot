import type { Notification } from '@/interfaces/Notification';
import { NotificationComponent } from '../notification-component/NotificationComponent';
import styles from './NotificationContainer.module.css';

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
