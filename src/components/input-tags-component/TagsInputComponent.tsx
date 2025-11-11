import { useState } from 'react';
import styles from './TagsInputComponent.module.css';
import { InputComponent, TagsComponent } from '@components/index';
import type { FieldError } from 'react-hook-form';

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
    const [nameError, setNameError] = useState<FieldError | undefined>();
    const [urlError, setUrlError] = useState<FieldError | undefined>();

    const displayNameToId = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const validateName = (): boolean => {
        const value = data.name.trim();
        if (value === '') {
            setNameError({
                type: 'required',
                message: 'El nombre de la etiqueta es obligatorio',
            } as FieldError);
            return false;
        }
        setNameError(undefined);
        return true;
    };

    const validateUrl = (): boolean => {
        const value = data.url.trim();
        if (value === '') {
            setUrlError({
                type: 'required',
                message: 'La URL de la etiqueta es obligatoria',
            } as FieldError);
            return false;
        }

        const isAbsoluteUrl = (() => {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        })();

        const domainLikeRegex =
            /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/\S*)?$/i;

        if (!isAbsoluteUrl && !domainLikeRegex.test(value)) {
            setUrlError({
                type: 'pattern',
                message:
                    'La URL no es válida. Debe incluir https:// o un dominio como dominio.tld',
            } as FieldError);
            return false;
        }

        setUrlError(undefined);
        return true;
    };

    const handleAdd = () => {
        const okName = validateName();
        const okUrl = validateUrl();
        if (!okName || !okUrl) return;
        const newTag = { name: data.name.trim(), url: data.url.trim() };
        setTags((s) => [...s, newTag]);
        onAdd?.(newTag);
        setData({ name: '', url: '' });
        setNameError(undefined);
        setUrlError(undefined);
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
                        validationProps={{
                            onChange: (
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));
                                if (nameError) setNameError(undefined);
                            },
                            onBlur: () => {
                                validateName();
                            },
                        }}
                        errors={nameError}
                        onKeyDown={handleKeyDown}
                        id={`tag-${displayNameToId(nameLabel)}-name`}
                    />
                </div>
                <div className={styles.inputRight}>
                    <InputComponent
                        type="text"
                        label={urlLabel}
                        value={data.url}
                        validationProps={{
                            onChange: (
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setData((prev) => ({
                                    ...prev,
                                    url: e.target.value,
                                }));
                                if (urlError) setUrlError(undefined);
                            },
                            onBlur: () => {
                                validateUrl();
                            },
                        }}
                        errors={urlError}
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
