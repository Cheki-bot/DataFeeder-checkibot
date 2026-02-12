import { useState, useRef, useEffect } from 'react';
import type { IUser } from '@/interfaces/User';
import styles from './ActionsMenu.module.css';

interface ActionsMenuProps {
    user: IUser;
    onEdit: (user: IUser) => void;
    onToggleActive: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

export const ActionsMenu = ({
    user,
    onEdit,
    onToggleActive,
    onDelete,
}: ActionsMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.menuWrapper} ref={ref}>
            <button
                className={styles.menuButton}
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Acciones"
            >
                <span className={styles.dotsIcon}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </span>
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <button
                        className={styles.dropdownItem}
                        onClick={() => {
                            onEdit(user);
                            setOpen(false);
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                fill="currentColor"
                            />
                        </svg>
                        Editar
                    </button>

                    <button
                        className={`${styles.dropdownItem} ${user.is_active ? styles.warning : styles.success}`}
                        onClick={() => {
                            onToggleActive(user);
                            setOpen(false);
                        }}
                    >
                        {user.is_active ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0112 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0112 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                                    fill="currentColor"
                                />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                        {user.is_active ? 'Desactivar' : 'Activar'}
                    </button>

                    <button
                        className={`${styles.dropdownItem} ${styles.danger}`}
                        onClick={() => {
                            onDelete(user);
                            setOpen(false);
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                fill="currentColor"
                            />
                        </svg>
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};
