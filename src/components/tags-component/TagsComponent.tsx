import React from 'react';
import { StateLayer } from '../../assets/svg/icons/state-layer';
import styles from './TagsComponent.module.css';

export interface Tag {
    name: string;
    url: string;
}

interface TagsComponentProps {
    tags: Tag[];
    onRemove?: (index: number) => void;
    removable?: boolean; // Nueva prop global
}

export const TagsComponent: React.FC<TagsComponentProps> = ({
    tags,
    onRemove,
    removable = true,
}) => {
    return (
        <div className={styles.pillsRow}>
            <div className={styles.pillsInner}>
                {tags.map((t, idx) => (
                    <div key={`${t.name}-${idx}`} className={styles.pill}>
                        <span className={styles.pillText}>{t.name}</span>
                        {removable && (
                            <button
                                className={styles.pillClose}
                                onClick={() => onRemove?.(idx)}
                                aria-label={`Remove ${t.name}`}
                            >
                                <StateLayer />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagsComponent;
