import { useState, useCallback } from 'react';
import type { Notification, NotificationType } from '@/interfaces/Notification';

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (message: string, type: NotificationType = 'info', duration = 3000) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newNotification: Notification = {
                id,
                message,
                type,
                duration,
            };

            setNotifications((prev) => [...prev, newNotification]);
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
        );
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
    };
};
