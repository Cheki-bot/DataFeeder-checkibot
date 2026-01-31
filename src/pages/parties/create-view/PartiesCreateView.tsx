import { useExcel } from '@/hooks/useExcel';
import { useNotification } from '@/hooks/useNotification';
import type { IPoliticalParty } from '@/interfaces/Candidacies';
import {
    ButtonComponent,
    InputComponent,
    ModalComponent,
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

export const PartiesCreateView = () => {
    const [showForm, setShowForm] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState<boolean>(false);
    const [sheet, setSheet] = useState<CustomSheet>({
        sheet: {} as xlsx.WorkSheet,
        file: {} as File,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { notifications, addNotification, removeNotification } = useNotification();

    const columns = {
        name: 'Nombre',
        sigla: 'Sigla',
        description: 'Descripción',
        logoUrl: 'Logo URL',
        founded: 'Fundación',
    };

    const { data: excelData, message } = useExcel(sheet.sheet, columns);

    useEffect(() => {
        if (message) addNotification(message, 'success');
    }, [message, addNotification]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PartyFormData>({
        resolver: zodResolver(partySchema),
        defaultValues: {
            name: '',
            sigla: '',
            description: '',
            logoUrl: '',
            founded: '',
        },
    });

    const onSubmit = async (data: PartyFormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createCandidacy(data as IPoliticalParty);
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
            const mappedData = excelData.map((row) => ({
                name: row['Nombre'],
                sigla: row['Sigla'],
                description: row['Descripción'],
                logoUrl: row['Logo URL'],
                founded: row['Fundación'],
            }));

            await createMultipleCandidacies(mappedData as IPoliticalParty[]);
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
            <p className={style.backButtonMain} onClick={() => navigate(-1)}>
                Volver
            </p>
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
                        label="Subir Excel"
                        onClick={() => fileInputRef.current?.click()}
                    />
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
                    {...register('name')}
                    errors={errors.name}
                />
                <InputComponent
                    label="Sigla"
                    type="text"
                    {...register('sigla')}
                    errors={errors.sigla}
                />
                <InputComponent
                    label="Descripción"
                    type="text"
                    {...register('description')}
                    errors={errors.description}
                />
                <InputComponent
                    label="Logo URL"
                    type="text"
                    {...register('logoUrl')}
                    errors={errors.logoUrl}
                />
                <InputComponent
                    label="Fundación"
                    type="text"
                    {...register('founded')}
                    errors={errors.founded}
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
