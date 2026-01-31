import { useCalendarForm } from '@/hooks/useCalendarForm';
import type { ElectoralCalendar } from '@/interfaces/Calendar';
import { deleteCalendar, getAllCalendars } from '@/services/calendar.service';
import { CalendarForm } from '@components/calendar-form/CalendarForm';
import { CardComponent } from '@components/card-component/CardComponent';
import { ModalComponent } from '@components/modal-component/ModalComponent';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './CalendarListView.module.css';

export const CalendarListView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [calendars, setCalendars] = useState<ElectoralCalendar[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

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

    const {
        data,
        showCreateModal,
        showEditModal,
        error,
        creating,
        updating,
        openCreateModal,
        closeModal,
        openEditModal,
        updateFormField,
        submitCreate,
        submitEdit,
    } = useCalendarForm(fetchCalendars);

    useEffect(() => {
        fetchCalendars();
    }, [fetchCalendars]);

    useEffect(() => {
        const state = location.state as { editCalendarId?: string } | null;
        if (state?.editCalendarId) {
            openEditModal(state.editCalendarId);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate, openEditModal]);

    const handleDelete = useCallback(
        async (calendarId: string) => {
            if (
                !confirm(
                    '¿Estás seguro de que deseas eliminar este calendario?'
                )
            ) {
                return;
            }

            try {
                await deleteCalendar(calendarId);
                await fetchCalendars();
            } catch (err) {
                console.error('Error deleting calendar:', err);
                setListError('Error al eliminar el calendario');
            }
        },
        [fetchCalendars]
    );

    const handleNavigateToDetail = useCallback(
        (calendarId: string) => {
            navigate(`/calendars/${calendarId}`);
        },
        [navigate]
    );

    const handleEditCalendar = useCallback(
        (calendarId: string) => {
            openEditModal(calendarId);
        },
        [openEditModal]
    );

    const handleDeleteCalendar = useCallback(
        (calendarId: string) => {
            handleDelete(calendarId);
        },
        [handleDelete]
    );

    const handleSubmitCreate = () => {
        submitCreate();
    };

    const handleSubmitEdit = () => {
        submitEdit();
    };

    const renderModal = (
        isOpen: boolean,
        onSubmit: () => void,
        title: string,
        acceptLabel: string,
        isLoading: boolean,
        idPrefix?: string
    ) => (
        <ModalComponent
            isOpen={isOpen}
            onClose={closeModal}
            Accept={onSubmit}
            acceptLabel={acceptLabel}
            isLoading={isLoading}
        >
            <h2 className={styles.modalTitle}>{title}</h2>
            <CalendarForm
                formData={data}
                onFieldChange={updateFormField}
                error={error}
                idPrefix={idPrefix}
            />
        </ModalComponent>
    );

    const renderEmptyState = (message: string, isError = false) => (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={isError ? styles.error : styles.loading}>
                    {message}
                </div>
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
                            description={
                                calendar.introduction || 'Sin descripción'
                            }
                            detailsModal={() =>
                                handleNavigateToDetail(calendar._id)
                            }
                            onEdit={() => handleEditCalendar(calendar._id)}
                            onDelete={() => handleDeleteCalendar(calendar._id)}
                        />
                    ))}
                    <CardComponent forAddCard detailsModal={openCreateModal} />
                </div>
            </div>

            {renderModal(
                showCreateModal,
                handleSubmitCreate,
                'Crear Calendario Electoral',
                'Guardar y Cerrar',
                creating
            )}

            {renderModal(
                showEditModal,
                handleSubmitEdit,
                'Editar Calendario Electoral',
                'Guardar Cambios',
                updating,
                'edit-'
            )}
        </div>
    );
};
