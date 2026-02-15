import { useExcel } from '@/hooks/useExcel';
import { useNotification } from '@/hooks/useNotification';
import type { Verification } from '@/interfaces/Verification';
import {
    createMultipleVerifications,
    createVerification,
    deleteVerification,
    getVerifications,
} from '@/pages/verifications/service/verifications.service';
import { AddButton } from '@components/add-button-component/AddButton';
import {
    ButtonComponent,
    InputComponent,
    ModalComponent,
    SheetPreview,
    TagsInputComponent,
} from '@components/index';
import type { Tag } from '@components/input-tags-component/TagsInputComponent';
import { ListComponent } from '@components/list-component/ListComponent';
import { NotificationContainer } from '@components/notification-container/NotificationContainer';
import { SearchComponent } from '@components/search-component/SearchComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import xlsx from 'xlsx';
import {
    verificationSchema,
    type VerificationFormData,
} from '../schemas/verificationSchema';
import styles from './VerificationCreateView.module.css';
import { normalizeRow } from '../utils/normalize-text';
import { ReloadIcon } from '@/assets/svg/icons/reload-icon';

interface CustomSheet {
    sheet: xlsx.WorkSheet;
    file: File;
}

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
    const [modal, setModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedVerificationId, setSelectedVerificationId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tagsInputKey, setTagsInputKey] = useState(0);
    const [isReloading, setIsReloading] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.innerWidth <= 768;
    });
    const [sheet, setSheet] = useState<CustomSheet>({
        sheet: {} as xlsx.WorkSheet,
        file: {} as File,
    });
    const searchWrapperRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const columns = {
        title: 'Titulo',
        summary: 'Resumen',
        body: 'Cuerpo',
        classified_as: 'Clasificación',
        section_url: 'URL de la Sección',
        url: 'URL de la Fuente',
        publication_date: 'Fecha de Publicación',
        tags: 'Etiquetas',
    };

    const { data, message } = useExcel(sheet.sheet, columns);

    useEffect(() => {
        if (message) {
            addNotification(message, 'success');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    const processedData = data.map((row) =>
        normalizeRow(row as Record<string, string>)
    );

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

    const handleUpload = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = xlsx.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            setSheet({ sheet: worksheet, file });
        };

        reader.readAsArrayBuffer(file);
        setModal(true);
    };

    const uploadData = async () => {
        if (!data || data.length === 0) return;
        try {
            const mappedData = (data as Record<string, string>[]).map(
                (row) => ({
                    title: row['Titulo'] || '',
                    summary: row['Resumen'] || '',
                    body: row['Cuerpo'] || '',
                    classified_as: row['Clasificación'] || '',
                    section_url: row['URL de la Sección'] || '',
                    url: row['URL de la Fuente'] || '',
                    publication_date: row['Fecha de Publicación'] || '',
                    tags: row['Etiquetas']
                        ? row['Etiquetas']
                              .split(/\s*,\s*/)
                              .map((chunk: string) => {
                                  const [name, rawUrl] = chunk
                                      .split('|')
                                      .map((v) => v.trim());
                                  if (!name) return null;
                                  const url =
                                      rawUrl && !rawUrl.startsWith('http')
                                          ? `https://${rawUrl}`
                                          : rawUrl;
                                  return { name, ...(url ? { url } : {}) };
                              })
                              .filter(Boolean)
                        : [],
                })
            );
            await createMultipleVerifications(
                mappedData as unknown as Verification[]
            );
            addNotification(
                'Verificaciones agregadas desde Excel correctamente',
                'success'
            );
        } catch (error) {
            addNotification(
                'Error al agregar verificaciones desde Excel',
                'error'
            );
            console.error(error);
        } finally {
            setSheet({ sheet: {} as xlsx.WorkSheet, file: {} as File });
            setModal(false);
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

    const reloadVerifications = async () => {
        try {
            setIsReloading(true);
            const response = await getVerifications();
            setVerifications(response);
        } finally {
            setIsReloading(false);
        }
    };

    const shouldShowForm = isMobile ? showForm : true;

    return (
        <div className={styles.container}>
            <div className={styles.uploadButton}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className={styles.fileInput}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                    }}
                />
                <SheetPreview
                    columns={[
                        { header: 'Titulo', example: 'Título de ejemplo' },
                        { header: 'Resumen', example: 'Resumen breve...' },
                        { header: 'Cuerpo', example: 'Contenido completo...' },
                        { header: 'Clasificación', example: 'Verdadero' },
                        { header: 'URL de la Sección', example: 'https://...' },
                        { header: 'URL de la Fuente', example: 'https://...' },
                        { header: 'Fecha de Publicación', example: '2026-01-15' },
                        { header: 'Etiquetas', example: 'tag1|url1, tag2|url2' },
                    ]}
                >
                    <ButtonComponent
                        light
                        label="Subir Excel"
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                    />
                </SheetPreview>
            </div>
            {modal && (
                <ModalComponent
                    isOpen={modal}
                    Accept={() => uploadData()}
                    children={
                        <div>
                            <h2>Confirmar subida de archivo</h2>
                            <p>
                                ¿Estás seguro de que deseas subir el archivo{' '}
                                <span className={styles.fileName}>
                                    {sheet?.file.name}
                                </span>{' '}
                                al sistema desde Excel? Se agregarán las
                                siguientes verificaciones:{' '}
                            </p>
                            <ol className={styles.previewList}>
                                {processedData.map((row, index) => (
                                    <li key={index}>
                                        <strong
                                            className={styles.previewLabelTitle}
                                        >
                                            Título:
                                        </strong>{' '}
                                        {
                                            (row as Record<string, string>)[
                                                'Titulo'
                                            ]
                                        }{' '}
                                        <br />
                                        <strong
                                            className={
                                                styles.previewLabelAnswer
                                            }
                                        >
                                            Resumen:
                                        </strong>{' '}
                                        {
                                            (row as Record<string, string>)[
                                                'Resumen'
                                            ]
                                        }{' '}
                                        <hr className={styles.QuestionLine} />
                                    </li>
                                ))}
                            </ol>
                        </div>
                    }
                    onClose={() => {
                        setModal(false);
                    }}
                />
            )}
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
                    <div className={styles.twoColumns}>
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
                    </div>
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
                    <div className={styles.twoColumns}>
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
                    </div>
                    <InputComponent
                        label="Fecha de Publicación"
                        type="date"
                        value={watch('publicationDate') || ''}
                        validationProps={register('publicationDate')}
                        errors={errors.publicationDate}
                        onClear={() => resetField('publicationDate')}
                    />
                    <div className={styles.inputWrapper}>
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
                    </div>
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
                            <div className={styles.listHeader}>
                                <SearchComponent
                                    data={filteredVerifications.map((v) => ({
                                        name: `${v.title} - ${v.classified_as}`,
                                    }))}
                                    searchKeys={['name']}
                                    hasDropdown={true}
                                />
                                <ButtonComponent
                                    onlyIcon
                                    onClick={reloadVerifications}
                                    children={
                                        <ReloadIcon
                                            className={`${styles.reloadIcon} ${
                                                isReloading ? styles.spin : ''
                                            }`}
                                        />
                                    }
                                />
                            </div>
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
                                items={filteredVerifications.map((v) => ({
                                    label: `${v.title} - ${v.classified_as}`,
                                }))}
                                onSelectionChange={(selectedLabels) => {
                                    const last =
                                        selectedLabels[
                                            selectedLabels.length - 1
                                        ];
                                    if (!last) {
                                        setSelectedVerificationId('');
                                        return;
                                    }
                                    const label =
                                        typeof last === 'string'
                                            ? last
                                            : ((last as { label?: string })
                                                  .label ?? '');
                                    const match = filteredVerifications.find(
                                        (v) =>
                                            `${v.title} - ${v.classified_as}` ===
                                            label
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
