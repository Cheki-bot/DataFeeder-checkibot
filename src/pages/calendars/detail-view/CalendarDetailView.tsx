import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import { ButtonComponent } from '@components/index';
import { ModalComponent } from '@components/modal-component/ModalComponent';
import { EventForm } from '@components/event-form/EventForm';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { getCalendarById, deleteCalendar, updateCalendar } from '@/services/calendar.service';
import styles from './CalendarDetailView.module.css';

interface EventFormData {
    scenery: string;
    activity: string;
    from_date: string;
    to_date: string;
    duration: number;
    reference: string;
    place: string;
}

export const CalendarDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState<ElectoralCalendar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para el modal de eventos
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
    const [eventForm, setEventForm] = useState<EventFormData>({
        scenery: '',
        activity: '',
        from_date: '',
        to_date: '',
        duration: 0,
        reference: '',
        place: ''
    });

    useEffect(() => {
        const fetchCalendar = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await getCalendarById(id);
                setCalendar(response.data);
            } catch (err) {
                console.error('Error fetching calendar:', err);
                setError('Error al cargar el calendario');
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [id]);

    const handleOpenEventModal = (index?: number) => {
        if (index !== undefined && calendar?.events[index]) {
            const event = calendar.events[index];
            setEditingEventIndex(index);
            setEventForm({
                scenery: event.scenery || '',
                activity: event.activity || '',
                from_date: event.from_date ? new Date(event.from_date).toISOString().split('T')[0] : '',
                to_date: event.to_date ? new Date(event.to_date).toISOString().split('T')[0] : '',
                duration: event.duration || 0,
                reference: event.reference || '',
                place: event.place || ''
            });
        } else {
            setEditingEventIndex(null);
            setEventForm({
                scenery: '',
                activity: '',
                from_date: '',
                to_date: '',
                duration: 0,
                reference: '',
                place: ''
            });
        }
        setShowEventModal(true);
    };

    const handleCloseEventModal = () => {
        setShowEventModal(false);
        setEditingEventIndex(null);
        setEventForm({
            scenery: '',
            activity: '',
            from_date: '',
            to_date: '',
            duration: 0,
            reference: '',
            place: ''
        });
    };

    const handleEventInputChange = (field: keyof EventFormData, value: string | number) => {
        setEventForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitEvent = async () => {
        if (!calendar || !id) return;

        const newEvent = {
            scenery: eventForm.scenery,
            activity: eventForm.activity,
            from_date: eventForm.from_date ? new Date(eventForm.from_date) : undefined,
            to_date: eventForm.to_date ? new Date(eventForm.to_date) : undefined,
            duration: eventForm.duration,
            reference: eventForm.reference,
            place: eventForm.place
        };

        let updatedEvents = [...(calendar.events || [])];
        
        if (editingEventIndex !== null) {
            updatedEvents[editingEventIndex] = {
                ...newEvent,
                no: editingEventIndex + 1
            };
        } else {
            updatedEvents.push({
                ...newEvent,
                no: updatedEvents.length + 1
            });
        }

        // Renumerar todos los eventos
        updatedEvents = updatedEvents.map((event, index) => ({
            ...event,
            no: index + 1
        }));

        try {
            await updateCalendar(id, { events: updatedEvents });
            const response = await getCalendarById(id);
            setCalendar(response.data);
            handleCloseEventModal();
        } catch (err) {
            console.error('Error updating events:', err);
            setError('Error al guardar el evento');
        }
    };

    const handleDeleteEvent = async (index: number) => {
        if (!calendar || !id) return;
        
        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            return;
        }

        let updatedEvents = calendar.events.filter((_, i) => i !== index);
        
        // Renumerar todos los eventos
        updatedEvents = updatedEvents.map((event, idx) => ({
            ...event,
            no: idx + 1
        }));

        try {
            await updateCalendar(id, { events: updatedEvents });
            const response = await getCalendarById(id);
            setCalendar(response.data);
        } catch (err) {
            console.error('Error deleting event:', err);
            setError('Error al eliminar el evento');
        }
    };

    const handleEdit = () => {
        navigate('/calendars', { state: { editCalendarId: id } });
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este calendario?')) {
            return;
        }

        if (!id) return;

        try {
            await deleteCalendar(id);
            navigate('/calendars');
        } catch (err) {
            console.error('Error deleting calendar:', err);
            setError('Error al eliminar el calendario');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.loading}>Cargando calendario...</div>
                </div>
            </div>
        );
    }

    if (error || !calendar) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.error}>{error || 'Calendario no encontrado'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <HeaderComponent type="simple" />
            <div className={styles.content}>
                <h1 className={styles.title}>{calendar.title}</h1>
                <div className={styles.metadata}>
                    <p><strong>Resolución:</strong> {calendar.resolution}</p>
                    <p><strong>Fecha:</strong> {new Date(calendar.date).toLocaleDateString()}</p>
                    {calendar.introduction && (
                        <p className={styles.introduction}>{calendar.introduction}</p>
                    )}
                    {calendar.pdf_url && (
                        <a href={calendar.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                            Ver PDF
                        </a>
                    )}
                </div>

                                <div className={styles.eventsGrid}>
                    {calendar.events && calendar.events.map((event, index) => (
                        <div key={event._id || index} className={styles.eventCardWrapper}>
                            <div className={styles.eventCard}>
                                <div className={styles.eventHeader}>
                                    <div className={styles.avatar}>E</div>
                                    <div className={styles.eventHeaderText}>
                                        <h3>{event.scenery || 'Sin escenario'}</h3>
                                        <p>Evento</p>
                                    </div>
                                </div>
                                <div className={styles.eventContent}>
                                    <h4>{event.activity || 'Sin actividad'}</h4>
                                    {event.from_date && (
                                        <p><strong>Desde:</strong> {new Date(event.from_date).toLocaleDateString()}</p>
                                    )}
                                    {event.to_date && (
                                        <p><strong>Hasta:</strong> {new Date(event.to_date).toLocaleDateString()}</p>
                                    )}
                                    {event.duration && (
                                        <p><strong>Duración:</strong> {event.duration} días</p>
                                    )}
                                    {event.reference && (
                                        <p><strong>Referencia:</strong> {event.reference}</p>
                                    )}
                                    {event.place && (
                                        <p><strong>Lugar:</strong> {event.place}</p>
                                    )}
                                </div>
                                <div className={styles.eventActions}>
                                    <ButtonComponent
                                        label="Editar"
                                        onClick={() => handleOpenEventModal(index)}
                                    />
                                    <ButtonComponent
                                        label="Eliminar"
                                        onClick={() => handleDeleteEvent(index)}
                                        danger
                                    />
                                </div>
                            </div>
                            {index < calendar.events.length - 1 && (
                                <div className={styles.arrow}>→</div>
                            )}
                        </div>
                    ))}
                    
                    <div className={styles.addEventCard} onClick={() => handleOpenEventModal()}>
                        <div className={styles.addEventIcon}>+</div>
                        <p>Agregar Evento</p>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <ButtonComponent
                        label="Editar Calendario"
                        onClick={handleEdit}
                    />
                    <ButtonComponent
                        label="Eliminar Calendario"
                        onClick={handleDelete}
                        danger
                    />
                    <ButtonComponent
                        label="Volver a la lista"
                        onClick={() => navigate('/calendars')}
                    />
                </div>

                <ModalComponent
                    isOpen={showEventModal}
                    onClose={handleCloseEventModal}
                    Accept={handleSubmitEvent}
                    acceptLabel={editingEventIndex !== null ? 'Guardar Cambios' : 'Agregar Evento'}
                >
                    <h2 className={styles.modalTitle}>
                        {editingEventIndex !== null ? 'Editar Evento' : 'Agregar Evento'}
                    </h2>
                    <EventForm
                        formData={eventForm}
                        onFieldChange={handleEventInputChange}
                    />
                </ModalComponent>
            </div>
        </div>
    );
};
