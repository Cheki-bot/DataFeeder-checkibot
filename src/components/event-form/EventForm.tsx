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
    const handleChange =
        (field: keyof EventFormData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value =
                field === 'duration'
                    ? parseInt(e.target.value) || 0
                    : e.target.value;
            onFieldChange(field, value);
        };

    return (
        <div className={styles.formContainer}>
            <InputComponent
                label="Escenario"
                type="text"
                value={formData.scenery}
                validationProps={{
                    onChange: handleChange('scenery'),
                }}
                required
            />
            <InputComponent
                label="Actividad"
                type="text"
                value={formData.activity}
                validationProps={{
                    onChange: handleChange('activity'),
                }}
                required
            />
            <InputComponent
                label="Fecha Inicio"
                type="date"
                value={formData.from_date}
                validationProps={{
                    onChange: handleChange('from_date'),
                }}
                required
            />
            <InputComponent
                label="Fecha Fin"
                type="date"
                value={formData.to_date}
                validationProps={{
                    onChange: handleChange('to_date'),
                }}
                required
            />
            <InputComponent
                label="Duración (días)"
                type="number"
                value={formData.duration.toString()}
                validationProps={{
                    onChange: handleChange('duration'),
                }}
                required
            />
            <InputComponent
                label="Referencia"
                type="text"
                value={formData.reference}
                validationProps={{
                    onChange: handleChange('reference'),
                }}
            />
            <InputComponent
                label="Lugar"
                type="text"
                value={formData.place}
                validationProps={{
                    onChange: handleChange('place'),
                }}
            />
        </div>
    );
};
