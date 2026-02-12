import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ActionsMenu.module.css';

export interface TableAction<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    variant?: 'default' | 'danger' | 'success' | 'warning';
    hidden?: (item: T) => boolean;
}

interface ActionsMenuProps<T> {
    item: T;
    actions: TableAction<T>[];
}

export const ActionsMenu = <T,>({ item, actions }: ActionsMenuProps<T>) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const calculatePosition = useCallback(() => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = actions.filter((a) => !a.hidden?.(item)).length * 40;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < dropdownHeight + 8;

        setPosition({
            top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
            left: rect.right - 160,
        });
    }, [actions, item]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open) return;

        const handleScroll = () => setOpen(false);
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [open]);

    const handleToggle = () => {
        if (!open) calculatePosition();
        setOpen((prev) => !prev);
    };

    const variantClass = (variant?: string) => {
        switch (variant) {
            case 'danger':
                return styles.danger;
            case 'success':
                return styles.success;
            case 'warning':
                return styles.warning;
            default:
                return '';
        }
    };

    const visibleActions = actions.filter((a) => !a.hidden?.(item));

    return (
        <div className={styles.menuWrapper} ref={ref}>
            <button
                ref={buttonRef}
                className={styles.menuButton}
                onClick={handleToggle}
                aria-label="Acciones"
            >
                <span className={styles.dotsIcon}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </span>
            </button>

            {open && (
                <div
                    className={styles.dropdown}
                    style={{ top: position.top, left: position.left }}
                >
                    {visibleActions.map((action, index) => (
                        <button
                            key={index}
                            className={`${styles.dropdownItem} ${variantClass(action.variant)}`}
                            onClick={() => {
                                action.onClick(item);
                                setOpen(false);
                            }}
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
