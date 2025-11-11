import style from './CalendarEventsView.module.css';
import { ButtonComponent, InputComponent } from '@/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    calendarEventSchema,
    type CalendarEventPayload,
} from './schemas/calendarEventSchema';

const CalendarEventsView = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        resetField,
    } = useForm<CalendarEventPayload>({
        resolver: zodResolver(calendarEventSchema),
        defaultValues: {
            scenery: '',
            no: 1,
            activity: '',
            days: 0,
            from_date: '',
            to_date: '',
            duration: 1,
            reference: '',
            place: '',
            calendar_id: '',
        },
    });

    const onSubmit = (data: CalendarEventPayload) => {
        console.log('Nuevo evento de calendario:', data);
        reset();
    };

    return (
        <div className={style.container}>
            <div className={style.card}>
                <div className={style.cardHeader}>
                    <h2>Fechas importantes</h2>
                </div>
                <form
                    className={style.form}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <InputComponent
                        label="Escenario"
                        type="text"
                        value={watch('scenery')}
                        validationProps={register('scenery')}
                        errors={errors.scenery}
                        onClear={() => resetField('scenery')}
                    />
                    <InputComponent
                        label="Número"
                        type="number"
                        value={String(watch('no') ?? '')}
                        validationProps={register('no', {
                            valueAsNumber: true,
                        })}
                        errors={errors.no}
                        onClear={() => resetField('no')}
                    />
                    <InputComponent
                        label="Actividad"
                        type="text"
                        value={watch('activity')}
                        validationProps={register('activity')}
                        errors={errors.activity}
                        onClear={() => resetField('activity')}
                    />
                    <InputComponent
                        label="Días"
                        type="number"
                        value={String(watch('days') ?? '')}
                        validationProps={register('days', {
                            valueAsNumber: true,
                        })}
                        errors={errors.days}
                        onClear={() => resetField('days')}
                    />
                    <InputComponent
                        label="Fecha Inicio"
                        type="date"
                        value={watch('from_date')}
                        validationProps={register('from_date')}
                        errors={errors.from_date}
                        onClear={() => resetField('from_date')}
                    />
                    <InputComponent
                        label="Fecha Fin"
                        type="date"
                        value={watch('to_date')}
                        validationProps={register('to_date')}
                        errors={errors.to_date}
                        onClear={() => resetField('to_date')}
                    />
                    <InputComponent
                        label="Duración"
                        type="number"
                        value={String(watch('duration') ?? '')}
                        validationProps={register('duration', {
                            valueAsNumber: true,
                        })}
                        errors={errors.duration}
                        onClear={() => resetField('duration')}
                    />
                    <InputComponent
                        label="Referencia"
                        type="text"
                        value={watch('reference')}
                        validationProps={register('reference')}
                        errors={errors.reference}
                        onClear={() => resetField('reference')}
                    />
                    <InputComponent
                        label="Lugar"
                        type="text"
                        value={watch('place')}
                        validationProps={register('place')}
                        errors={errors.place}
                        onClear={() => resetField('place')}
                    />
                    <InputComponent
                        label="ID Calendario"
                        type="text"
                        value={watch('calendar_id')}
                        validationProps={register('calendar_id')}
                        errors={errors.calendar_id}
                        onClear={() => resetField('calendar_id')}
                    />
                    <span className={style.buttonContainer}>
                        <ButtonComponent label="Guardar Evento" type="submit" />
                    </span>
                </form>
            </div>
        </div>
    );
};

export default CalendarEventsView;
