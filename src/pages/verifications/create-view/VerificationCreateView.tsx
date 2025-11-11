import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import {
    ButtonComponent,
    InputComponent,
    TagsInputComponent,
} from '@components/index';
import { AddButton } from '@components/add-button-component/AddButton';
import { ListComponent } from '@components/list-component/ListComponent';
import { SearchComponent } from '@components/search-component/SearchComponent';
import { NotificationContainer } from '@components/notification-container/NotificationContainer';
import styles from './VerificationCreateView.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    verificationSchema,
    type VerificationFormData,
} from '../schemas/verificationSchema';
import type { Tag } from '@components/input-tags-component/TagsInputComponent';
import { useNotification } from '@/hooks/useNotification';
import {
    createVerification,
    deleteVerification,
    getVerifications,
} from '@/pages/verifications/service/verifications.service';
import type { Verification } from '@/interfaces/Verification';

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === 'string') {
            return data;
        }
        if (Array.isArray(data)) {
            return data.join(', ');
        }
        if (data && typeof data === 'object') {
            const message = (data as Record<string, unknown>).message;
            const errorMessage = (data as Record<string, unknown>).error;
            if (typeof message === 'string') return message;
            if (Array.isArray(message)) return message.join(', ');
            if (typeof errorMessage === 'string') return errorMessage;
        }
        return error.message ?? 'Ocurrió un error en la solicitud.';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Ocurrió un error inesperado.';
};

const toIsoDate = (date: string): string => {
    if (!date) {
        return new Date().toISOString();
    }
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
    }
    const fallback = new Date(`${date}T00:00:00Z`);
    if (!Number.isNaN(fallback.getTime())) {
        return fallback.toISOString();
    }
    return new Date().toISOString();
};

export const VerificationCreateView = () => {
    const [showForm, setShowForm] = useState(false);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedVerificationId, setSelectedVerificationId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tagsInputKey, setTagsInputKey] = useState(0);
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.innerWidth <= 768;
    });
    const searchWrapperRef = useRef<HTMLDivElement | null>(null);

    const { notifications, addNotification, removeNotification } =
        useNotification();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchVerifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getVerifications();
            setVerifications(data);
        } catch (error) {
            addNotification(getErrorMessage(error), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchVerifications();
    }, [fetchVerifications]);

    useEffect(() => {
        const wrapper = searchWrapperRef.current;
        if (!wrapper) {
            return;
        }
        const input = wrapper.querySelector('input');
        if (!input) {
            return;
        }

        const handleInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            setSearchTerm(target.value);
        };

        input.addEventListener('input', handleInput);
        return () => {
            input.removeEventListener('input', handleInput);
        };
    }, []);

    useEffect(() => {
        const input = searchWrapperRef.current?.querySelector('input');
        if (input && input.value !== searchTerm) {
            input.value = searchTerm;
        }
    }, [searchTerm]);

    const filteredVerifications = useMemo(() => {
        if (!searchTerm.trim()) {
            return verifications;
        }
        const term = searchTerm.trim().toLowerCase();
        return verifications.filter((verification) => {
            const titleMatch = verification.title.toLowerCase().includes(term);
            const summaryMatch = verification.summary
                .toLowerCase()
                .includes(term);
            const classificationMatch = verification.classified_as
                .toLowerCase()
                .includes(term);
            return titleMatch || summaryMatch || classificationMatch;
        });
    }, [verifications, searchTerm]);

    useEffect(() => {
        if (
            selectedVerificationId &&
            !filteredVerifications.some(
                (verification) => verification._id === selectedVerificationId
            )
        ) {
            setSelectedVerificationId('');
        }
    }, [filteredVerifications, selectedVerificationId]);

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
            sectionUrl: '',
            url: '',
            publicationDate: '',
            tags: [],
        },
    });

    const handleTagAdd = (tag: Tag) => {
        const current = watch('tags') || [];
        const next = [...current, tag];
        setValue('tags', next, { shouldValidate: true });
    };

    const onSubmit = async (data: VerificationFormData) => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                title: data.title,
                summary: data.summary,
                body: data.body,
                classified_as: data.classification,
                section_url: data.sectionUrl,
                url: data.url,
                publication_date: toIsoDate(data.publicationDate),
                tags: data.tags,
            };
            const created = await createVerification(payload);
            setVerifications((prev) => [
                created,
                ...prev.filter((item) => item._id !== created._id),
            ]);
            addNotification('Verificación creada correctamente.', 'success');
            reset();
            setValue('tags', []);
            setTagsInputKey((prev) => prev + 1);
            setShowForm(false);
        } catch (error) {
            addNotification(getErrorMessage(error), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedVerificationId) {
            addNotification(
                'Selecciona una verificación para eliminarla.',
                'warning'
            );
            return;
        }
        if (isDeleting) {
            return;
        }
        setIsDeleting(true);
        try {
            await deleteVerification(selectedVerificationId);
            setVerifications((prev) =>
                prev.filter(
                    (verification) =>
                        verification._id !== selectedVerificationId
                )
            );
            addNotification('Verificación eliminada correctamente.', 'success');
            setSelectedVerificationId('');
        } catch (error) {
            addNotification(getErrorMessage(error), 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const shouldShowForm = isMobile ? showForm : true;

    return (
        <div className={styles.container}>
            <NotificationContainer
                notifications={notifications}
                onClose={removeNotification}
            />
            {showForm && isMobile && (
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
                    style={{ display: shouldShowForm ? 'flex' : 'none' }}
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
                        label="URL de la Sección"
                        type="text"
                        value={watch('sectionUrl') || ''}
                        validationProps={register('sectionUrl')}
                        errors={errors.sectionUrl}
                        onClear={() => resetField('sectionUrl')}
                    />
                    <InputComponent
                        label="URL de la Fuente"
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
                        key={tagsInputKey}
                        label="Etiquetas"
                        nameLabel="Nombre etiqueta"
                        urlLabel="URL etiqueta"
                        onAdd={handleTagAdd}
                    />
                    {errors.tags ? (
                        <span className={styles.validationMessage}>
                            {errors.tags.message as string}
                        </span>
                    ) : null}
                    <span className={styles.buttonContainer}>
                        <ButtonComponent
                            label={
                                isSubmitting
                                    ? 'Creando...'
                                    : 'Crear Verificación'
                            }
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </span>
                </section>
                {!showForm && (
                    <div className={styles.listContainer}>
                        <div ref={searchWrapperRef}>
                            <SearchComponent />
                        </div>
                        <div className={styles.listActions}>
                            <label className={styles.selectLabel}>
                                Selecciona una verificación
                            </label>
                        </div>
                        {isLoading && (
                            <p className={styles.listStatus}>
                                Cargando verificaciones...
                            </p>
                        )}
                        {!isLoading && filteredVerifications.length === 0 ? (
                            <p className={styles.listStatus}>
                                No hay verificaciones para mostrar.
                            </p>
                        ) : null}
                        {filteredVerifications.length > 0 && (
                            <ListComponent
                                items={filteredVerifications.map(
                                    (v) => `${v.title} - ${v.classified_as}`
                                )}
                                onSelectionChange={(selectedLabels) => {
                                    const last = selectedLabels[selectedLabels.length - 1];
                                    if (!last) {
                                        setSelectedVerificationId('');
                                        return;
                                    }
                                    const match = filteredVerifications.find(
                                        (v) => `${v.title} - ${v.classified_as}` === last
                                    );
                                    setSelectedVerificationId(match?._id ?? '');
                                }}
                            />
                        )}
                        <span className={styles.buttonContainer}>
                            <ButtonComponent
                                label={
                                    isDeleting ? 'Eliminando...' : 'Eliminar'
                                }
                                type="button"
                                danger
                                onClick={handleDelete}
                            />
                        </span>
                    </div>
                )}
            </div>
            {!showForm && <AddButton onClick={() => setShowForm(true)} />}
        </div>
    );
};
