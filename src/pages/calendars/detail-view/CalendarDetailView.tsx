import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import { ButtonComponent } from '@components/index';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { getCalendarById, deleteCalendar } from '@/services/calendar.service';
import styles from './CalendarDetailView.module.css';

export const CalendarDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState<ElectoralCalendar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleEdit = () => {
        navigate(`/calendars/edit/${id}`);
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
                    {calendar.events && calendar.events.length > 0 ? (
                        calendar.events.map((event, index) => (
                            <div key={event._id || index} className={styles.eventCard}>
                                <div className={styles.eventHeader}>
                                    <div className={styles.avatar}>A</div>
                                    <div className={styles.eventHeaderText}>
                                        <h3>Header</h3>
                                        <p>Subhead</p>
                                    </div>
                                </div>
                                <div className={styles.eventContent}>
                                    <h4>{event.activity || 'Sin actividad'}</h4>
                                    <p><strong>Escenario:</strong> {event.scenery || 'N/A'}</p>
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
                                {index < calendar.events.length - 1 && (
                                    <div className={styles.arrow}>→</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noEvents}>
                            <p>No hay eventos registrados en este calendario.</p>
                        </div>
                    )}
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
            </div>
        </div>
    );
};
