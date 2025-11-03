import { useState } from 'react';
import styles from './TagsInputComponent.module.css';
import { InputComponent, TagsComponent } from '@components/index';

export type Tag = {
    name: string;
    url: string;
};

interface TagsInputProps {
    nameLabel?: string;
    urlLabel?: string;
    onAdd?: (tag: Tag) => void;
    label?: string;
    placeholder?: string;
}

export const TagsInputComponent = (props: TagsInputProps) => {
    const { nameLabel = 'Name', urlLabel = 'URL Tag', onAdd } = props;
    const [data, setData] = useState<Tag>({
        name: '',
        url: '',
    });
    const [tags, setTags] = useState<Tag[]>([]);

    const displayNameToId = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const canAdd = data.name.trim() !== '' && data.url.trim() !== '';

    const handleAdd = () => {
        if (!canAdd) return;
        const newTag = { name: data.name.trim(), url: data.url.trim() };
        setTags((s) => [...s, newTag]);
        onAdd?.(newTag);
        setData({ name: '', url: '' });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className={styles.container}>
            {props.label ? (
                <label className={styles.label}>{props.label}</label>
            ) : null}
            <div className={styles.row}>
                <div className={styles.inputLeft}>
                    <InputComponent
                        type="text"
                        label={nameLabel}
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        onKeyDown={handleKeyDown}
                        id={`tag-${displayNameToId(nameLabel)}-name`}
                    />
                </div>
                <div className={styles.inputRight}>
                    <InputComponent
                        type="text"
                        label={urlLabel}
                        value={data.url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setData((prev) => ({
                                ...prev,
                                url: e.target.value,
                            }))
                        }
                        onKeyDown={handleKeyDown}
                        id={`tag-${displayNameToId(urlLabel)}-url`}
                    />
                </div>
            </div>
            <div className={styles.tagsArea}>
                <TagsComponent
                    tags={tags}
                    onRemove={(index: number) =>
                        setTags((s) => s.filter((_, i) => i !== index))
                    }
                />
            </div>
        </div>
    );
};
