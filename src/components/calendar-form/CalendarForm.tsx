import { InputComponent } from '@/components';
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CalendarFormData } from '@/pages/calendars/schemas/calendarSchema';
import styles from './CalendarForm.module.css';

interface CalendarFormProps {
    register: UseFormRegister<CalendarFormData>;
    errors: FieldErrors<CalendarFormData>;
    setValue: UseFormSetValue<CalendarFormData>;
    watch: UseFormWatch<CalendarFormData>;
    control?: Control<CalendarFormData>;
    idPrefix?: string;
}

export const CalendarForm = ({ register, errors, setValue, watch, idPrefix = '' }: CalendarFormProps) => {
    return (
        <div className={styles.formContainer}>
            <InputComponent
                id={`${idPrefix}title`}
                label="Título"
                type="text"
                placeholder="Ej: Elecciones Generales 2025"
                value={watch('title') || ''}
                validationProps={register('title')}
                errors={errors.title}
                onClear={() => setValue('title', '', { shouldValidate: true })}
            />

            <InputComponent
                id={`${idPrefix}resolution`}
                label="Resolución"
                type="text"
                placeholder="Ej: TSE-RSP-ADM-001/2025"
                value={watch('resolution') || ''}
                validationProps={register('resolution')}
                errors={errors.resolution}
                onClear={() => setValue('resolution', '', { shouldValidate: true })}
            />

            <InputComponent
                id={`${idPrefix}date`}
                label="Fecha"
                type="date"
                value={watch('date') || ''}
                validationProps={register('date')}
                errors={errors.date}
                // onClear for date inputs might need specific handling or be omitted if InputComponent doesn't support it well for dates
                onClear={() => setValue('date', '', { shouldValidate: true })}
            />

            <InputComponent
                id={`${idPrefix}electionId`}
                label="ID de Elección"
                type="text"
                placeholder="Ej: EL-2025-001"
                value={watch('electionId') || ''}
                validationProps={register('electionId')}
                errors={errors.electionId}
                onClear={() => setValue('electionId', '', { shouldValidate: true })}
            />

            <InputComponent
                id={`${idPrefix}pdfUrl`}
                label="URL del PDF"
                type="text" // InputComponent might not have 'url' type styling, 'text' is safer generally
                placeholder="https://..."
                value={watch('pdfUrl') || ''}
                validationProps={register('pdfUrl')}
                errors={errors.pdfUrl}
                onClear={() => setValue('pdfUrl', '', { shouldValidate: true })}
            />

            <div className={styles.textareaContainer}>
                <label htmlFor={`${idPrefix}introduction`} className={styles.label}>
                    Introducción (Markdown)
                </label>
                <textarea
                    id={`${idPrefix}introduction`}
                    className={styles.textarea}
                    placeholder="Puedes usar Markdown para formatear el texto..."
                    rows={4}
                    {...register('introduction')}
                />
                {errors.introduction && <span className={styles.error}>{errors.introduction.message}</span>}
            </div>

            <div className={styles.note}>
                <p>Nota: Los campos de firmas y eventos se pueden agregar después de crear el calendario.</p>
            </div>
        </div>
    );
};
