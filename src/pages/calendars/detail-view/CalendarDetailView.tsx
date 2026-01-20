import { useEventForm } from '@/hooks/useEventForm';
import { deleteCalendar } from '@/services/calendar.service';
import { EventForm } from '@components/event-form/EventForm';
import { ButtonComponent } from '@components/index';
import { ModalComponent } from '@components/modal-component/ModalComponent';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './CalendarDetailView.module.css';

export const CalendarDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const {
        calendar,
        loading,
        error,
        showEventModal,
        editingEventIndex,
        eventForm,
        savingEvent,
        fetchCalendar,
        openCreateEventModal,
        openEditEventModal,
        closeEventModal,
        updateEventField,
        submitEvent,
        deleteEvent,
        setError
    } = useEventForm();

    useEffect(() => {
        if (id) {
            fetchCalendar(id);
        }
    }, [id, fetchCalendar]);

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

    const handleSubmitEvent = () => {
        if (!id) return;
        submitEvent(id);
    };

    const handleDeleteEvent = (index: number) => {
        if (!id) return;
        deleteEvent(id, index);
    };

    const handleOpenEventModal = (index?: number) => {
        if (index !== undefined) {
            openEditEventModal(index);
        } else {
            openCreateEventModal();
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.loading}>Cargando calendario...</div>
                </div>
            </div>
        );
    }

    if (error || !calendar) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.error}>{error || 'Calendario no encontrado'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
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
                            {index < (calendar?.events.length ?? 0) - 1 && (
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
                    onClose={closeEventModal}
                    Accept={handleSubmitEvent}
                    acceptLabel={editingEventIndex !== null ? 'Guardar Cambios' : 'Agregar Evento'}
                    isLoading={savingEvent}
                >
                    <h2 className={styles.modalTitle}>
                        {editingEventIndex !== null ? 'Editar Evento' : 'Agregar Evento'}
                    </h2>
                    <EventForm
                        formData={eventForm}
                        onFieldChange={updateEventField}
                    />
                </ModalComponent>
            </div>
        </div>
    );
};
