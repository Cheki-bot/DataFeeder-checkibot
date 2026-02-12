import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalComponent } from '@/components';
import { CalendarForm } from '@/components/calendar-form/CalendarForm';
import { createCalendar, updateCalendar } from '@/services/calendar.service';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { calendarSchema, type CalendarFormData } from '../schemas/calendarSchema';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    calendarToEdit?: ElectoralCalendar | null;
}

export const CalendarModal = ({ isOpen, onClose, onSuccess, calendarToEdit }: CalendarModalProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CalendarFormData>({
        resolver: zodResolver(calendarSchema),
        defaultValues: {
            title: '',
            resolution: '',
            date: new Date().toISOString().split('T')[0],
            electionId: '',
            pdfUrl: '',
            introduction: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (calendarToEdit) {
                reset({
                    title: calendarToEdit.title,
                    resolution: calendarToEdit.resolution,
                    date: new Date(calendarToEdit.date).toISOString().split('T')[0],
                    electionId: calendarToEdit.election_id,
                    pdfUrl: calendarToEdit.pdf_url,
                    introduction: calendarToEdit.introduction || '',
                });
            } else {
                reset({
                    title: '',
                    resolution: '',
                    date: new Date().toISOString().split('T')[0],
                    electionId: '',
                    pdfUrl: '',
                    introduction: '',
                });
            }
        }
    }, [isOpen, calendarToEdit, reset]);

    const onSubmit = async (data: CalendarFormData) => {
        try {
            if (calendarToEdit) {
                await updateCalendar(calendarToEdit._id, {
                    title: data.title,
                    resolution: data.resolution,
                    date: data.date,
                    election_id: data.electionId,
                    pdf_url: data.pdfUrl,
                    introduction: data.introduction,
                });
            } else {
                await createCalendar({
                    title: data.title,
                    resolution: data.resolution,
                    date: data.date,
                    election_id: data.electionId,
                    pdf_url: data.pdfUrl,
                    introduction: data.introduction,
                    signatures: [],
                    events: [],
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving calendar:', error);
            // Ideally we would show a notification here, but simpler to just log for now or rely on parent to handle if we propagated error
            // For now, let's assume success or console error. 
            // Better: use a notification hook if available in this context, but I'll stick to the plan's scope.
            alert('Error al guardar el calendario. Revisa la consola para más detalles.');
        }
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            Accept={handleSubmit(onSubmit)}
            acceptLabel={calendarToEdit ? 'Guardar Cambios' : 'Crear Calendario'}
            isLoading={isSubmitting}
        >
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                {calendarToEdit ? 'Editar Calendario Electoral' : 'Crear Calendario Electoral'}
            </h2>
            <CalendarForm
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
            />
        </ModalComponent>
    );
};
