import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CardComponent } from '@components/card-component/CardComponent';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import { ButtonComponent } from '@components/index';
import type { ElectoralCalendar, CreateElectoralCalendarData, UpdateElectoralCalendarData } from '@/interfaces/Calendar';
import { getAllCalendars, deleteCalendar, createCalendar, getCalendarById, updateCalendar } from '@/services/calendar.service';
import styles from './CalendarListView.module.css';

export const CalendarListView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
    
    // Form states
    const [title, setTitle] = useState('');
    const [resolution, setResolution] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [electionId, setElectionId] = useState('');

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

    // Detectar si se navega con el estado de editar
    useEffect(() => {
        const state = location.state as { editCalendarId?: string } | null;
        if (state?.editCalendarId) {
            const calendarId = state.editCalendarId;
            // Abrir modal de edición con el ID del calendario
            const loadCalendarForEdit = async () => {
                try {
                    setError(null);
                    const response = await getCalendarById(calendarId);
                    const calendar = response.data;
                    
                    // Cargar datos en el formulario
                    setTitle(calendar.title);
                    setResolution(calendar.resolution);
                    setDate(new Date(calendar.date).toISOString().split('T')[0]);
                    setPdfUrl(calendar.pdf_url || '');
                    setIntroduction(calendar.introduction || '');
                    setElectionId(calendar.election_id);
                    setEditingCalendarId(calendarId);
                    setShowEditModal(true);
                } catch (err) {
                    console.error('Error loading calendar:', err);
                    setError('Error al cargar el calendario');
                }
            };
            
            loadCalendarForEdit();
            // Limpiar el estado de navegación
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    const handleCreateNew = () => {
        setShowCreateModal(true);
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        // Reset form
        setTitle('');
        setResolution('');
        setDate(new Date().toISOString().split('T')[0]);
        setPdfUrl('');
        setIntroduction('');
        setElectionId('');
        setError(null);
    };

    const handleSubmitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setCreating(true);
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
            const response = await getAllCalendars();
            setCalendars(response.data);
            handleCloseModal();
        } catch (err) {
            console.error('Error creating calendar:', err);
            setError('Error al crear el calendario');
        } finally {
            setCreating(false);
        }
    };

    const handleViewDetails = (calendarId: string) => {
        navigate(`/calendars/${calendarId}`);
    };

    const handleEdit = async (calendarId: string) => {
        try {
            setError(null);
            const response = await getCalendarById(calendarId);
            const calendar = response.data;
            
            // Cargar datos en el formulario
            setTitle(calendar.title);
            setResolution(calendar.resolution);
            setDate(new Date(calendar.date).toISOString().split('T')[0]);
            setPdfUrl(calendar.pdf_url || '');
            setIntroduction(calendar.introduction || '');
            setElectionId(calendar.election_id);
            setEditingCalendarId(calendarId);
            setShowEditModal(true);
        } catch (err) {
            console.error('Error loading calendar:', err);
            setError('Error al cargar el calendario');
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingCalendarId(null);
        // Reset form
        setTitle('');
        setResolution('');
        setDate(new Date().toISOString().split('T')[0]);
        setPdfUrl('');
        setIntroduction('');
        setElectionId('');
        setError(null);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingCalendarId) return;
        
        try {
            setUpdating(true);
            setError(null);
            
            const formData: UpdateElectoralCalendarData = {
                title,
                resolution,
                date,
                pdf_url: pdfUrl,
                introduction,
                election_id: electionId,
            };

            await updateCalendar(editingCalendarId, formData);
            const response = await getAllCalendars();
            setCalendars(response.data);
            handleCloseEditModal();
        } catch (err) {
            console.error('Error updating calendar:', err);
            setError('Error al actualizar el calendario');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (calendarId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este calendario?')) {
            return;
        }

        try {
            await deleteCalendar(calendarId);
            const response = await getAllCalendars();
            setCalendars(response.data);
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
                    <div className={styles.loading}>Cargando calendarios...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.error}>{error}</div>
                </div>
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
                            onEdit={() => handleEdit(calendar._id)}
                            onDelete={() => handleDelete(calendar._id)}
                        />
                    ))}
                    <CardComponent
                        forAddCard
                        detailsModal={handleCreateNew}
                    />
                </div>
            </div>

            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Crear Calendario Electoral</h2>

                        {error && <div className={styles.modalError}>{error}</div>}

                        <form className={styles.modalForm} onSubmit={handleSubmitCreate}>
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

                            <div className={styles.modalActions}>
                                <ButtonComponent
                                    label="Cancelar"
                                    onClick={handleCloseModal}
                                    type="button"
                                />
                                <ButtonComponent
                                    label={creating ? 'Guardando...' : 'Guardar y Cerrar'}
                                    type="submit"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Editar Calendario Electoral</h2>

                        {error && <div className={styles.modalError}>{error}</div>}

                        <form className={styles.modalForm} onSubmit={handleSubmitEdit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-title">Título *</label>
                                <input
                                    id="edit-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-resolution">Resolución *</label>
                                <input
                                    id="edit-resolution"
                                    type="text"
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-date">Fecha *</label>
                                <input
                                    id="edit-date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-electionId">ID de Elección *</label>
                                <input
                                    id="edit-electionId"
                                    type="text"
                                    value={electionId}
                                    onChange={(e) => setElectionId(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-pdfUrl">URL del PDF *</label>
                                <input
                                    id="edit-pdfUrl"
                                    type="url"
                                    value={pdfUrl}
                                    onChange={(e) => setPdfUrl(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-introduction">Introducción (Markdown)</label>
                                <textarea
                                    id="edit-introduction"
                                    value={introduction}
                                    onChange={(e) => setIntroduction(e.target.value)}
                                    placeholder="Puedes usar Markdown para formatear el texto..."
                                    rows={4}
                                />
                            </div>

                            <div className={styles.note}>
                                <p>Nota: Los campos de firmas y eventos se pueden agregar después de editar el calendario.</p>
                            </div>

                            <div className={styles.modalActions}>
                                <ButtonComponent
                                    label="Cancelar"
                                    onClick={handleCloseEditModal}
                                    type="button"
                                />
                                <ButtonComponent
                                    label={updating ? 'Actualizando...' : 'Guardar Cambios'}
                                    type="submit"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
