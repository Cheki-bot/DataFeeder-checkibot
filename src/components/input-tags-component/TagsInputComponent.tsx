import { useState } from 'react';
import styles from './TagsInputComponent.module.css';
import { InputComponent, TagsComponent } from '@components';

interface TagsInputProps {
    nameLabel?: string;
    urlLabel?: string;
    onAdd?: (tag: { name: string; url: string }) => void;
    label?: string;
    placeholder?: string;
}

export const TagsInputComponent = (props: TagsInputProps) => {
    const { nameLabel = 'Name', urlLabel = 'URL Tag', onAdd } = props;
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [tags, setTags] = useState<Array<{ name: string; url: string }>>([]);

    const displayNameToId = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const canAdd = name.trim() !== '' && url.trim() !== '';

    const handleAdd = () => {
        if (!canAdd) return;
        const newTag = { name: name.trim(), url: url.trim() };
        setTags((s) => [...s, newTag]);
        onAdd?.(newTag);
        setName('');
        setUrl('');
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
                        placeholder={nameLabel}
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        id={`tag-${displayNameToId(nameLabel)}-name`}
                    />
                </div>
                <div className={styles.inputRight}>
                    <InputComponent
                        type="text"
                        label={urlLabel}
                        placeholder={urlLabel}
                        value={url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUrl(e.target.value)
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
