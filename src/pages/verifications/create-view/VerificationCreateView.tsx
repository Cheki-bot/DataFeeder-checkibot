import { useState } from 'react';
import {
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
} from '@components/index';
import { AddButton } from '@components/add-button-component/AddButton';
import { ListComponent } from '@components/list-component/ListComponent';
import { SearchComponent } from '@components/search-component/SearchComponent';
import styles from './VerificationCreateView.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    verificationSchema,
    type VerificationFormData,
} from '../schemas/verificationSchema';
import type { Tag } from '@components/input-tags-component/TagsInputComponent';

type VerificationItem = Pick<
    VerificationFormData,
    'title' | 'classification' | 'publicationDate'
>;

export const VerificationCreateView = () => {
    const [showForm, setShowForm] = useState(false);
    const [verifications, setVerifications] = useState<VerificationItem[]>([
        {
            title: 'Ejemplo 1',
            classification: 'Información',
            publicationDate: '2025-01-01',
        },
        {
            title: 'Ejemplo 2',
            classification: 'Falso',
            publicationDate: '2025-02-15',
        },
    ]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        resetField,
        setValue,
        formState: { errors },
    } = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            title: '',
            summary: '',
            body: '',
            classification: '',
            url: '',
            publicationDate: '',
            tags: [],
        },
    });

    const onSubmit = (data: VerificationFormData) => {
        setVerifications((prev) => [
            ...prev,
            {
                title: data.title,
                classification: data.classification,
                publicationDate: data.publicationDate,
            },
        ]);
        console.log('Nueva verificación:', data);
        reset();
        setShowForm(false);
    };

    const handleRemove = (items: Array<VerificationItem | string>) => {
        const titlesToRemove = items.map((i) =>
            typeof i === 'string' ? i : i.title
        );
        setVerifications((prev) =>
            prev.filter((v) => !titlesToRemove.includes(v.title))
        );
        console.log('Eliminadas:', titlesToRemove.join(', '));
    };

    return (
        <div className={styles.container}>
            {showForm && (
                <div className={styles.backButton}>
                    <ButtonComponent
                        onClick={() => setShowForm(false)}
                        type="button"
                        onlyIcon
                    >
                        <div className={styles.backContent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill="#ffff"
                                    fillOpacity=".8"
                                    fillRule="evenodd"
                                    d="M6.293 9.657 11.95 4l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-5.657-5.657a1 1 0 0 1 0-1.414Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p>Volver</p>
                        </div>
                    </ButtonComponent>
                </div>
            )}
            <h2>Verificaciones</h2>
            <div className={styles.content}>
                <section
                    className={styles.form}
                    style={{
                        display:
                            window.innerWidth <= 768
                                ? showForm
                                    ? 'flex'
                                    : 'none'
                                : 'flex',
                    }}
                >
                    <h3>Crear Verificación</h3>
                    <InputComponent
                        label="Título"
                        type="text"
                        value={watch('title') || ''}
                        validationProps={register('title')}
                        errors={errors.title}
                        onClear={() => resetField('title')}
                    />
                    <InputComponent
                        label="Resumen"
                        type="text"
                        value={watch('summary') || ''}
                        validationProps={register('summary')}
                        errors={errors.summary}
                        onClear={() => resetField('summary')}
                    />
                    <InputComponent
                        label="Cuerpo"
                        type="text"
                        value={watch('body') || ''}
                        validationProps={register('body')}
                        errors={errors.body}
                        onClear={() => resetField('body')}
                    />
                    <InputComponent
                        label="Clasificación"
                        type="text"
                        value={watch('classification') || ''}
                        validationProps={register('classification')}
                        errors={errors.classification}
                        onClear={() => resetField('classification')}
                    />
                    <InputComponent
                        label="URL"
                        type="text"
                        value={watch('url') || ''}
                        validationProps={register('url')}
                        errors={errors.url}
                        onClear={() => resetField('url')}
                    />
                    <InputComponent
                        label="Fecha de Publicación"
                        type="date"
                        value={watch('publicationDate') || ''}
                        validationProps={register('publicationDate')}
                        errors={errors.publicationDate}
                        onClear={() => resetField('publicationDate')}
                    />
                    <TagsInputComponent
                        label="Etiquetas"
                        nameLabel="Nombre etiqueta"
                        urlLabel="URL etiqueta"
                        onAdd={(tag: Tag) => {
                            const current = watch('tags') || [];
                            const next = [...current, tag];
                            setValue('tags', next, { shouldValidate: true });
                        }}
                    />
                    {errors.tags ? (
                        <span
                            style={{
                                color: 'var(--red-color)',
                                fontSize: '0.8rem',
                            }}
                        >
                            {errors.tags.message as string}
                        </span>
                    ) : null}
                    <span className={styles.buttonContainer}>
                        <ButtonComponent
                            label="Crear Verificación"
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </span>
                </section>
                {!showForm && (
                    <div className={styles.listContainer}>
                        <SearchComponent />
                        <ListComponent
                            items={verifications.map((v) => v.title)}
                        />
                        <span className={styles.buttonContainer}>
                            <ButtonComponent
                                label="Eliminar"
                                type="button"
                                danger
                                onClick={() => handleRemove(verifications)}
                            />
                        </span>
                    </div>
                )}
            </div>
            {!showForm && <AddButton onClick={() => setShowForm(true)} />}
        </div>
    );
};
