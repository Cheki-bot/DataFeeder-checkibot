import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import { ButtonComponent } from '@components/index';
import { ModalComponent } from '@components/modal-component/ModalComponent';
import { EventForm } from '@components/event-form/EventForm';
import { deleteCalendar } from '@/services/calendar.service';
import { useEventForm } from '@/hooks/useEventForm';
import styles from './CalendarDetailView.module.css';

export const CalendarDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const eventFormHook = useEventForm();

    useEffect(() => {
        if (id) {
            eventFormHook.fetchCalendar(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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
            eventFormHook.setError('Error al eliminar el calendario');
        }
    };

    const handleSubmitEvent = () => {
        if (!id) return;
        eventFormHook.submitEvent(id);
    };

    const handleDeleteEvent = (index: number) => {
        if (!id) return;
        eventFormHook.deleteEvent(id, index);
    };

    const handleOpenEventModal = (index?: number) => {
        if (index !== undefined) {
            eventFormHook.openEditEventModal(index);
        } else {
            eventFormHook.openCreateEventModal();
        }
    };

    if (eventFormHook.loading) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.loading}>Cargando calendario...</div>
                </div>
            </div>
        );
    }

    if (eventFormHook.error || !eventFormHook.calendar) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.error}>{eventFormHook.error || 'Calendario no encontrado'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <HeaderComponent type="simple" />
            <div className={styles.content}>
                <h1 className={styles.title}>{eventFormHook.calendar.title}</h1>
                <div className={styles.metadata}>
                    <p><strong>Resolución:</strong> {eventFormHook.calendar.resolution}</p>
                    <p><strong>Fecha:</strong> {new Date(eventFormHook.calendar.date).toLocaleDateString()}</p>
                    {eventFormHook.calendar.introduction && (
                        <p className={styles.introduction}>{eventFormHook.calendar.introduction}</p>
                    )}
                    {eventFormHook.calendar.pdf_url && (
                        <a href={eventFormHook.calendar.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                            Ver PDF
                        </a>
                    )}
                </div>

                <div className={styles.eventsGrid}>
                    {eventFormHook.calendar.events && eventFormHook.calendar.events.map((event, index) => (
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
                            {index < (eventFormHook.calendar?.events.length ?? 0) - 1 && (
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
                    isOpen={eventFormHook.showEventModal}
                    onClose={eventFormHook.closeEventModal}
                    Accept={handleSubmitEvent}
                    acceptLabel={eventFormHook.editingEventIndex !== null ? 'Guardar Cambios' : 'Agregar Evento'}
                    isLoading={eventFormHook.savingEvent}
                >
                    <h2 className={styles.modalTitle}>
                        {eventFormHook.editingEventIndex !== null ? 'Editar Evento' : 'Agregar Evento'}
                    </h2>
                    <EventForm
                        formData={eventFormHook.eventForm}
                        onFieldChange={eventFormHook.updateEventField}
                    />
                </ModalComponent>
            </div>
        </div>
    );
};
