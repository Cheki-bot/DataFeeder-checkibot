import { useExcel } from '@/hooks/useExcel';
import { useNotification } from '@/hooks/useNotification';
import { CandidacyStatus } from '@/interfaces/Candidacies';
import {
    ButtonComponent,
    InputComponent,
    ModalComponent,
    SheetPreview,
} from '@/components/index';
import { NotificationContainer } from '@/components/notification-container/NotificationContainer';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import * as xlsx from 'xlsx';
import {
    partySchema,
    type PartyFormData,
} from '../schemas/partySchema';
import { createCandidacy, createMultipleCandidacies } from '../service/parties.service';
import style from './PartiesCreateView.module.css';
import { downloadExcelTemplate } from '@/lib/shared/download-template';
import { getAllCalendars } from '@/services/calendar.service';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { DropdownComponent } from '@/components/index';

interface CustomSheet {
    sheet: xlsx.WorkSheet;
    file: File;
}

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === 'string') return data;
        if (data && typeof data === 'object') {
            const message = (data as Record<string, unknown>).message;
            if (typeof message === 'string') return message;
        }
    }
    return error instanceof Error ? error.message : 'Error inesperado';
};



const COLUMNS = {
    name: 'Nombre',
    sigla: 'Sigla',
    description: 'Descripción',
    logoUrl: 'Logo URL',
    founded: 'Fundación',
    election_id: 'ID Elección',
    government_plan: 'Plan de Gobierno',
};

export const PartiesCreateView = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState<boolean>(false);
    const [sheet, setSheet] = useState<CustomSheet>({
        sheet: {} as xlsx.WorkSheet,
        file: {} as File,
    });
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { notifications, addNotification, removeNotification } = useNotification();

    useEffect(() => {
        const fetchCalendars = async () => {
            setIsLoadingCalendars(true);
            try {
                const response = await getAllCalendars();
                setCalendars(response.data);
            } catch (error) {
                console.error("Error fetching calendars", error);
                addNotification('Error al cargar calendarios', 'error');
            } finally {
                setIsLoadingCalendars(false);
            }
        };
        fetchCalendars();
    }, [addNotification]);

    const electionOptions = calendars.map(cal => ({
        label: cal.title,
        value: cal.election_id
    }));

    const { data: excelData, message } = useExcel(sheet.sheet, COLUMNS);

    useEffect(() => {
        if (message) addNotification(message, 'success');
    }, [message, addNotification]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        resetField,
        setValue,
        formState: { errors },
    } = useForm<PartyFormData>({
        resolver: zodResolver(partySchema),
        defaultValues: {
            name: '',
            sigla: '',
            description: '',
            logoUrl: '',
            founded: '',
            election_id: '',
            government_plan: '',
        },
    });

    const onSubmit = async (data: PartyFormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                party: {
                    name: data.name,
                    sigla: data.sigla,
                    description: data.description,
                    logoUrl: data.logoUrl,
                    founded: data.founded,
                },
                status: CandidacyStatus.ACTIVE,
                government_plan: data.government_plan,
                election_id: data.election_id,
                candidates: [{
                    full_name: 'Representante',
                    position: 'Por definir',
                    isActive: true
                }],
            };
            await createCandidacy(payload);
            addNotification('Partido creado correctamente.', 'success');
            reset();
            navigate(-1);
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
        if (!excelData || excelData.length === 0) return;
        try {


            const payloads = excelData.map((row) => ({
                party: {
                    name: row['Nombre'],
                    sigla: row['Sigla'],
                    description: row['Descripción'],
                    logoUrl: row['Logo URL'],
                    founded: row['Fundación'],
                },
                status: CandidacyStatus.ACTIVE,
                government_plan: row['Plan de Gobierno'] || '',
                election_id: row['ID Elección'] || '',
                candidates: [{
                    full_name: 'Representante',
                    position: 'Por definir',
                    isActive: true
                }],
            }));

            await createMultipleCandidacies(payloads);
            addNotification('Partidos cargados desde Excel correctamente', 'success');
            setModal(false);
            setSheet({ sheet: {} as xlsx.WorkSheet, file: {} as File });
            navigate(-1);
        } catch (error) {
            addNotification('Error al cargar Excel', 'error');
            console.error(error);
        }
    };

    return (
        <div className={style.container}>
            <ButtonComponent onClick={() => navigate(-1)} type="button" onlyIcon>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <p>Volver</p>
                </div>
            </ButtonComponent>
            <div className={style.header}>
                <h1>Crear Nuevo Partido</h1>
                <div className={style.uploadButton}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className={style.fileInput}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                        }}
                    />
                    <ButtonComponent
                        light
                        label="Descargar Plantilla"
                        onClick={() =>
                            downloadExcelTemplate(
                                ['Nombre', 'Sigla', 'Descripción', 'Logo URL', 'Fundación', 'ID Elección', 'Plan de Gobierno'],
                                'plantilla-partidos'
                            )
                        }
                    />
                    <SheetPreview
                        columns={[
                            { header: 'Nombre', example: 'Partido Ejemplo' },
                            { header: 'Sigla', example: 'PE' },
                            { header: 'Descripción', example: 'Descripción del partido' },
                            { header: 'Logo URL', example: 'https://...' },
                            { header: 'Fundación', example: '2020' },
                            { header: 'ID Elección', example: 'abc123' },
                            { header: 'Plan de Gobierno', example: 'Plan...' },
                        ]}
                    >
                        <ButtonComponent
                            light
                            label="Subir Excel"
                            onClick={() => fileInputRef.current?.click()}
                        />
                    </SheetPreview>
                </div>
            </div>

            {modal && (
                <ModalComponent
                    isOpen={modal}
                    Accept={uploadData}
                    onClose={() => setModal(false)}
                >
                    <div>
                        <h2>Confirmar carga</h2>
                        <p>Se cargarán {excelData.length} partidos desde {sheet.file.name}</p>
                    </div>
                </ModalComponent>
            )}

            <NotificationContainer
                notifications={notifications}
                onClose={removeNotification}
            />

            <form className={style.form}>
                <InputComponent
                    label="Nombre"
                    type="text"
                    value={watch('name') || ''}
                    validationProps={register('name')}
                    onClear={() => resetField('name')}
                    errors={errors.name}
                />
                <InputComponent
                    label="Sigla"
                    type="text"
                    value={watch('sigla') || ''}
                    validationProps={register('sigla')}
                    onClear={() => resetField('sigla')}
                    errors={errors.sigla}
                />
                <InputComponent
                    label="Descripción"
                    type="text"
                    value={watch('description') || ''}
                    validationProps={register('description')}
                    onClear={() => resetField('description')}
                    errors={errors.description}
                />
                <InputComponent
                    label="Logo URL"
                    type="text"
                    value={watch('logoUrl') || ''}
                    validationProps={register('logoUrl')}
                    onClear={() => resetField('logoUrl')}
                    errors={errors.logoUrl}
                />
                <InputComponent
                    label="Fundación"
                    type="text"
                    value={watch('founded') || ''}
                    validationProps={register('founded')}
                    onClear={() => resetField('founded')}
                    errors={errors.founded}
                />

                <DropdownComponent
                    options={electionOptions}
                    value={watch('election_id') || ''}
                    onChange={(val) => {
                        setValue('election_id', val, { shouldValidate: true });
                    }}
                    error={errors.election_id?.message}
                    placeholder={isLoadingCalendars ? "Cargando calendarios..." : "Selecciona un calendario"}
                />

                <InputComponent
                    label="Plan de Gobierno"
                    type="text"
                    value={watch('government_plan') || ''}
                    validationProps={register('government_plan')}
                    onClear={() => resetField('government_plan')}
                    errors={errors.government_plan}
                />

                <div className={style.buttonContainer}>
                    <ButtonComponent
                        label={isSubmitting ? 'Guardando...' : 'Guardar Partido'}
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </form>
        </div>
    );
};
