import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CardComponent } from '@components/card-component/CardComponent';
import { HeaderComponent } from '@components/header-component/HeaderComponent';
import { ButtonComponent } from '@components/index';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { getAllCalendars, deleteCalendar } from '@/services/calendar.service';
import { useCalendarForm } from '@/hooks/useCalendarForm';
import styles from './CalendarListView.module.css';

export const CalendarListView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    const fetchCalendars = async () => {
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
    };

    const calendarForm = useCalendarForm(fetchCalendars);

    useEffect(() => {
        fetchCalendars();
    }, []);

    useEffect(() => {
        const state = location.state as { editCalendarId?: string } | null;
        if (state?.editCalendarId) {
            calendarForm.openEditModal(state.editCalendarId);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    const handleDelete = async (calendarId: string) => {
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
    };

    const handleSubmitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await calendarForm.submitCreate();
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        await calendarForm.submitEdit();
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

    if (listError) {
        return (
            <div className={styles.container}>
                <HeaderComponent type="simple" />
                <div className={styles.content}>
                    <div className={styles.error}>{listError}</div>
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
                            detailsModal={() => navigate(`/calendars/${calendar._id}`)}
                            onEdit={() => calendarForm.openEditModal(calendar._id)}
                            onDelete={() => handleDelete(calendar._id)}
                        />
                    ))}
                    <CardComponent
                        forAddCard
                        detailsModal={calendarForm.openCreateModal}
                    />
                </div>
            </div>

            {calendarForm.showCreateModal && (
                <div className={styles.modalOverlay} onClick={calendarForm.closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Crear Calendario Electoral</h2>

                        {calendarForm.error && <div className={styles.modalError}>{calendarForm.error}</div>}

                        <form className={styles.modalForm} onSubmit={handleSubmitCreate}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="title">Título *</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={calendarForm.formData.title}
                                    onChange={(e) => calendarForm.updateFormField('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="resolution">Resolución *</label>
                                <input
                                    id="resolution"
                                    type="text"
                                    value={calendarForm.formData.resolution}
                                    onChange={(e) => calendarForm.updateFormField('resolution', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="date">Fecha *</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={calendarForm.formData.date}
                                    onChange={(e) => calendarForm.updateFormField('date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="electionId">ID de Elección *</label>
                                <input
                                    id="electionId"
                                    type="text"
                                    value={calendarForm.formData.electionId}
                                    onChange={(e) => calendarForm.updateFormField('electionId', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="pdfUrl">URL del PDF *</label>
                                <input
                                    id="pdfUrl"
                                    type="url"
                                    value={calendarForm.formData.pdfUrl}
                                    onChange={(e) => calendarForm.updateFormField('pdfUrl', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="introduction">Introducción (Markdown)</label>
                                <textarea
                                    id="introduction"
                                    value={calendarForm.formData.introduction}
                                    onChange={(e) => calendarForm.updateFormField('introduction', e.target.value)}
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
                                    onClick={calendarForm.closeModal}
                                    type="button"
                                />
                                <ButtonComponent
                                    label={calendarForm.creating ? 'Guardando...' : 'Guardar y Cerrar'}
                                    type="submit"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {calendarForm.showEditModal && (
                <div className={styles.modalOverlay} onClick={calendarForm.closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Editar Calendario Electoral</h2>

                        {calendarForm.error && <div className={styles.modalError}>{calendarForm.error}</div>}

                        <form className={styles.modalForm} onSubmit={handleSubmitEdit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-title">Título *</label>
                                <input
                                    id="edit-title"
                                    type="text"
                                    value={calendarForm.formData.title}
                                    onChange={(e) => calendarForm.updateFormField('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-resolution">Resolución *</label>
                                <input
                                    id="edit-resolution"
                                    type="text"
                                    value={calendarForm.formData.resolution}
                                    onChange={(e) => calendarForm.updateFormField('resolution', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-date">Fecha *</label>
                                <input
                                    id="edit-date"
                                    type="date"
                                    value={calendarForm.formData.date}
                                    onChange={(e) => calendarForm.updateFormField('date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-electionId">ID de Elección *</label>
                                <input
                                    id="edit-electionId"
                                    type="text"
                                    value={calendarForm.formData.electionId}
                                    onChange={(e) => calendarForm.updateFormField('electionId', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-pdfUrl">URL del PDF *</label>
                                <input
                                    id="edit-pdfUrl"
                                    type="url"
                                    value={calendarForm.formData.pdfUrl}
                                    onChange={(e) => calendarForm.updateFormField('pdfUrl', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="edit-introduction">Introducción (Markdown)</label>
                                <textarea
                                    id="edit-introduction"
                                    value={calendarForm.formData.introduction}
                                    onChange={(e) => calendarForm.updateFormField('introduction', e.target.value)}
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
                                    onClick={calendarForm.closeModal}
                                    type="button"
                                />
                                <ButtonComponent
                                    label={calendarForm.updating ? 'Actualizando...' : 'Guardar Cambios'}
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
