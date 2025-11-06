import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ButtonComponent } from '@components/index';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import type { UpdateElectoralCalendarData } from '@/interfaces/Calendar';
import { getCalendarById, updateCalendar } from '@/services/calendar.service';
import styles from './CalendarEditView.module.css';

export const CalendarEditView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [resolution, setResolution] = useState('');
    const [date, setDate] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [electionId, setElectionId] = useState('');

    useEffect(() => {
        const fetchCalendar = async () => {
            if (!id) return;
            
            try {
                setLoadingData(true);
                const response = await getCalendarById(id);
                const calendar = response.data;
                
                setTitle(calendar.title);
                setResolution(calendar.resolution);
                setDate(new Date(calendar.date).toISOString().split('T')[0]);
                setPdfUrl(calendar.pdf_url);
                setIntroduction(calendar.introduction || '');
                setElectionId(calendar.election_id);
            } catch (err) {
                console.error('Error fetching calendar:', err);
                setError('Error al cargar el calendario');
            } finally {
                setLoadingData(false);
            }
        };

        fetchCalendar();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const formData: UpdateElectoralCalendarData = {
                title,
                resolution,
                date,
                pdf_url: pdfUrl,
                introduction,
                election_id: electionId,
            };

            await updateCalendar(id, formData);
            navigate('/calendars');
        } catch (err) {
            console.error('Error updating calendar:', err);
            setError('Error al actualizar el calendario');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.loading}>Cargando calendario...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <HeaderComponent type="simple" />
            <div className={styles.content}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Editar Calendario Electoral</h2>

                    {error && <div className={styles.error}>{error}</div>}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="title">Título *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="resolution">Resolución *</label>
                            <input
                                id="resolution"
                                type="text"
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="date">Fecha *</label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="electionId">ID de Elección *</label>
                            <input
                                id="electionId"
                                type="text"
                                value={electionId}
                                onChange={(e) => setElectionId(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="pdfUrl">URL del PDF *</label>
                            <input
                                id="pdfUrl"
                                type="url"
                                value={pdfUrl}
                                onChange={(e) => setPdfUrl(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="introduction">Introducción (Markdown)</label>
                            <textarea
                                id="introduction"
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                                placeholder="Puedes usar Markdown para formatear el texto..."
                                rows={4}
                            />
                        </div>

                        <div className={styles.note}>
                            <p>Nota: La edición de firmas y eventos estará disponible próximamente.</p>
                        </div>

                        <div className={styles.actions}>
                            <ButtonComponent
                                label="Cancelar"
                                onClick={() => navigate('/calendars')}
                                type="button"
                            />
                            <ButtonComponent
                                label={loading ? 'Actualizando...' : 'Guardar Cambios'}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
