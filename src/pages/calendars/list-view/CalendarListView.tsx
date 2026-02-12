import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { deleteCalendar, getAllCalendars } from '@/services/calendar.service';
import { CardComponent } from '@components/card-component/CardComponent';
import { CalendarModal } from '@/pages/calendars/modals/CalendarModal';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './CalendarListView.module.css';

export const CalendarListView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState<ElectoralCalendar | null>(null);

    const fetchCalendars = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllCalendars();
            setCalendars(response.data);
        } catch (err) {
            console.error('Error fetching calendars:', err);
            setListError('Error al cargar los calendarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCalendars();
    }, [fetchCalendars]);

    useEffect(() => {
        const state = location.state as { editCalendarId?: string } | null;
        if (state?.editCalendarId && calendars.length > 0) {
            const calendarToEdit = calendars.find(c => c._id === state.editCalendarId);
            if (calendarToEdit) {
                setSelectedCalendar(calendarToEdit);
                setIsModalOpen(true);
            }
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate, calendars]);

    const handleDelete = useCallback(async (calendarId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este calendario?')) {
            return;
        }

        try {
            await deleteCalendar(calendarId);
            await fetchCalendars();
        } catch (err) {
            console.error('Error deleting calendar:', err);
            setListError('Error al eliminar el calendario');
        }
    }, [fetchCalendars]);

    const handleNavigateToDetail = useCallback((calendarId: string) => {
        navigate(`/calendars/${calendarId}`);
    }, [navigate]);

    const handleEditCalendar = useCallback((calendarId: string) => {
        const calendar = calendars.find(c => c._id === calendarId);
        if (calendar) {
            setSelectedCalendar(calendar);
            setIsModalOpen(true);
        }
    }, [calendars]);

    const handleCreateCalendar = useCallback(() => {
        setSelectedCalendar(null);
        setIsModalOpen(true);
    }, []);

    const handleModalSuccess = useCallback(() => {
        fetchCalendars();
    }, [fetchCalendars]);

    const renderEmptyState = (message: string, isError = false) => (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={isError ? styles.error : styles.loading}>{message}</div>
            </div>
        </div>
    );

    if (loading) {
        return renderEmptyState('Cargando calendarios...');
    }

    if (listError) {
        return renderEmptyState(listError, true);
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Calendarios Electorales</h1>
                <div className={styles.grid}>
                    {calendars.map((calendar) => (
                        <CardComponent
                            key={calendar._id}
                            title={calendar.title}
                            subtitle={calendar.resolution}
                            description={calendar.introduction || 'Sin descripción'}
                            detailsModal={() => handleNavigateToDetail(calendar._id)}
                            onEdit={() => handleEditCalendar(calendar._id)}
                            onDelete={() => handleDelete(calendar._id)}
                        />
                    ))}
                    <CardComponent
                        forAddCard
                        detailsModal={handleCreateCalendar}
                    />
                </div>
            </div>

            <CalendarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                calendarToEdit={selectedCalendar}
            />
        </div>
    );
};
