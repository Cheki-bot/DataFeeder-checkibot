import {
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
} from '@components/index';
import styles from './VerificationCreateView.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    verificationSchema,
    type VerificationFormData,
} from '../schemas/verificationSchema';
import type { Tag } from '@components/input-tags-component/TagsInputComponent';

export const VerificationCreateView = () => {
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
        console.log('Nueva verificación:', data);
        reset();
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Añadir Verificación</h2>
                </div>
                <section className={styles.form}>
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
                    <ButtonComponent
                        label="Crear Verificación"
                        onClick={handleSubmit(onSubmit)}
                    />
                </section>
            </div>
        </div>
    );
};
