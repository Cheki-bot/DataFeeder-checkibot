import { InputComponent } from '@components/index';
import styles from './EventForm.module.css';

interface EventFormData {
    scenery: string;
    activity: string;
    from_date: string;
    to_date: string;
    duration: number;
    reference: string;
    place: string;
}

interface EventFormProps {
    formData: EventFormData;
    onFieldChange: (field: keyof EventFormData, value: string | number) => void;
}

export const EventForm = ({ formData, onFieldChange }: EventFormProps) => {
    return (
        <div className={styles.formContainer}>
            <InputComponent
                label="Escenario"
                type="text"
                value={formData.scenery}
                validationProps={{
                    onChange: (e) => onFieldChange('scenery', e.target.value)
                }}
                required
            />
            <InputComponent
                label="Actividad"
                type="text"
                value={formData.activity}
                validationProps={{
                    onChange: (e) => onFieldChange('activity', e.target.value)
                }}
                required
            />
            <InputComponent
                label="Fecha Inicio"
                type="date"
                value={formData.from_date}
                validationProps={{
                    onChange: (e) => onFieldChange('from_date', e.target.value)
                }}
                required
            />
            <InputComponent
                label="Fecha Fin"
                type="date"
                value={formData.to_date}
                validationProps={{
                    onChange: (e) => onFieldChange('to_date', e.target.value)
                }}
                required
            />
            <InputComponent
                label="Duración (días)"
                type="number"
                value={formData.duration.toString()}
                validationProps={{
                    onChange: (e) => onFieldChange('duration', parseInt(e.target.value) || 0)
                }}
                required
            />
            <InputComponent
                label="Referencia"
                type="text"
                value={formData.reference}
                validationProps={{
                    onChange: (e) => onFieldChange('reference', e.target.value)
                }}
            />
            <InputComponent
                label="Lugar"
                type="text"
                value={formData.place}
                validationProps={{
                    onChange: (e) => onFieldChange('place', e.target.value)
                }}
            />
        </div>
    );
};
