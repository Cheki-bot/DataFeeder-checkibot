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

export const CalendarForm = ({ formData, onFieldChange, error, idPrefix = '' }: CalendarFormProps) => {
    return (
        <>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}title`}>Título *</label>
                <input
                    id={`${idPrefix}title`}
                    type="text"
                    value={formData.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}resolution`}>Resolución *</label>
                <input
                    id={`${idPrefix}resolution`}
                    type="text"
                    value={formData.resolution}
                    onChange={(e) => onFieldChange('resolution', e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}date`}>Fecha *</label>
                <input
                    id={`${idPrefix}date`}
                    type="date"
                    value={formData.date}
                    onChange={(e) => onFieldChange('date', e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}electionId`}>ID de Elección *</label>
                <input
                    id={`${idPrefix}electionId`}
                    type="text"
                    value={formData.electionId}
                    onChange={(e) => onFieldChange('electionId', e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}pdfUrl`}>URL del PDF *</label>
                <input
                    id={`${idPrefix}pdfUrl`}
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => onFieldChange('pdfUrl', e.target.value)}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor={`${idPrefix}introduction`}>Introducción (Markdown)</label>
                <textarea
                    id={`${idPrefix}introduction`}
                    value={formData.introduction}
                    onChange={(e) => onFieldChange('introduction', e.target.value)}
                    placeholder="Puedes usar Markdown para formatear el texto..."
                    rows={4}
                />
            </div>

            <div className={styles.note}>
                <p>Nota: Los campos de firmas y eventos se pueden agregar después de crear el calendario.</p>
            </div>
        </>
    );
};
