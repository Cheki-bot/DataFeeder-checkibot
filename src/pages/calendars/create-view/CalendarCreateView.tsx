import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ButtonComponent } from '@components/index';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import type { CreateElectoralCalendarData } from '@/interfaces/Calendar';
import { createCalendar } from '@/services/calendar.service';
import styles from './CalendarCreateView.module.css';

export const CalendarCreateView = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [resolution, setResolution] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [electionId, setElectionId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);
            
            const formData: CreateElectoralCalendarData = {
                title,
                resolution,
                date,
                pdf_url: pdfUrl,
                introduction,
                election_id: electionId,
                signatures: [],
                events: [],
            };

            await createCalendar(formData);
            navigate('/calendars');
        } catch (err) {
            console.error('Error creating calendar:', err);
            setError('Error al crear el calendario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <HeaderComponent type="simple" />
            <div className={styles.content}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>Crear Calendario Electoral</h2>

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
                            <p>Nota: Los campos de firmas y eventos se pueden agregar después de crear el calendario.</p>
                        </div>

                        <div className={styles.actions}>
                            <ButtonComponent
                                label="Cancelar"
                                onClick={() => navigate('/calendars')}
                            />
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar y Cerrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
