import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CardComponent } from '@components/card-component/CardComponent';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { getAllCalendars } from '@/services/calendar.service';
import styles from './CalendarListView.module.css';

export const CalendarListView = () => {
    const navigate = useNavigate();
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                setLoading(true);
                const response = await getAllCalendars();
                setCalendars(response.data);
            } catch (err) {
                console.error('Error fetching calendars:', err);
                setError('Error al cargar los calendarios');
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, []);

    const handleCreateNew = () => {
        navigate('/calendars/create');
    };

    const handleViewDetails = (calendarId: string) => {
        navigate(`/calendars/${calendarId}`);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.loading}>Cargando calendarios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <HeaderComponent type="simple" />
            <div className={styles.content}>
                <h1 className={styles.title}>Choose your best option</h1>
                <div className={styles.grid}>
                    {calendars.map((calendar) => (
                        <CardComponent
                            key={calendar._id}
                            title={calendar.title}
                            subtitle={calendar.resolution}
                            description={calendar.introduction || 'Sin descripción'}
                            detailsModal={() => handleViewDetails(calendar._id)}
                        />
                    ))}
                    <CardComponent
                        forAddCard
                        detailsModal={handleCreateNew}
                    />
                </div>
            </div>
        </div>
    );
};
