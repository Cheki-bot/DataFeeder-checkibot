import styles from './CalendarForm.module.css';

interface CalendarFormData {
    title: string;
    resolution: string;
    date: string;
    pdfUrl: string;
    introduction: string;
    electionId: string;
}

interface CalendarFormProps {
    formData: CalendarFormData;
    onFieldChange: (field: keyof CalendarFormData, value: string) => void;
    error: string | null;
    idPrefix?: string;
}

interface FormFieldProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    pattern?: string;
    placeholder?: string;
    rows?: number;
}

const FormField = ({
    id,
    label,
    type,
    value,
    onChange,
    required,
    pattern,
    placeholder,
    rows,
}: FormFieldProps) => (
    <div className={styles.inputGroup}>
        <label htmlFor={id}>
            {label} {required && '*'}
        </label>
        {type === 'textarea' ? (
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
            />
        ) : (
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                pattern={pattern}
                placeholder={placeholder}
            />
        )}
    </div>
);

export const CalendarForm = ({
    formData,
    onFieldChange,
    error,
    idPrefix = '',
}: CalendarFormProps) => {
    return (
        <>
            {error && <div className={styles.error}>{error}</div>}

            <FormField
                id={`${idPrefix}title`}
                label="Título"
                type="text"
                value={formData.title}
                onChange={(value) => onFieldChange('title', value)}
                required
            />

            <FormField
                id={`${idPrefix}resolution`}
                label="Resolución"
                type="text"
                value={formData.resolution}
                onChange={(value) => onFieldChange('resolution', value)}
                required
            />

            <FormField
                id={`${idPrefix}date`}
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(value) => onFieldChange('date', value)}
                required
            />

            <FormField
                id={`${idPrefix}electionId`}
                label="ID de Elección"
                type="text"
                value={formData.electionId}
                onChange={(value) => onFieldChange('electionId', value)}
                required
                pattern="[A-Z0-9\-]+"
                placeholder="Ej: EL-2024-001"
            />

            <FormField
                id={`${idPrefix}pdfUrl`}
                label="URL del PDF"
                type="url"
                value={formData.pdfUrl}
                onChange={(value) => onFieldChange('pdfUrl', value)}
                required
            />

            <FormField
                id={`${idPrefix}introduction`}
                label="Introducción (Markdown)"
                type="textarea"
                value={formData.introduction}
                onChange={(value) => onFieldChange('introduction', value)}
                placeholder="Puedes usar Markdown para formatear el texto..."
                rows={4}
            />

            <div className={styles.note}>
                <p>
                    Nota: Los campos de firmas y eventos se pueden agregar
                    después de crear el calendario.
                </p>
            </div>
        </>
    );
};
