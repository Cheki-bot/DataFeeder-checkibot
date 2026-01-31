import { useReducer, useCallback } from 'react';
import type {
    CreateElectoralCalendarData,
    UpdateElectoralCalendarData,
} from '@/interfaces/Calendar';
import {
    createCalendar,
    updateCalendar,
    getCalendarById,
} from '@/services/calendar.service';

interface CalendarFormData {
    title: string;
    resolution: string;
    date: string;
    pdfUrl: string;
    introduction: string;
    electionId: string;
}

interface CalendarFormState {
    data: CalendarFormData;
    showCreateModal: boolean;
    showEditModal: boolean;
    creating: boolean;
    updating: boolean;
    editingCalendarId: string | null;
    error: string | null;
}

type CalendarFormAction =
    | { type: 'OPEN_CREATE_MODAL' }
    | {
          type: 'OPEN_EDIT_MODAL';
          payload: { id: string; data: CalendarFormData };
      }
    | { type: 'CLOSE_MODAL' }
    | {
          type: 'UPDATE_FIELD';
          payload: { field: keyof CalendarFormData; value: string };
      }
    | { type: 'SET_CREATING'; payload: boolean }
    | { type: 'SET_UPDATING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_FORM' };

interface UseCalendarFormReturn {
    data: CalendarFormData;
    showCreateModal: boolean;
    showEditModal: boolean;
    creating: boolean;
    updating: boolean;
    editingCalendarId: string | null;
    error: string | null;

    openCreateModal: () => void;
    openEditModal: (calendarId: string) => Promise<void>;
    closeModal: () => void;
    updateFormField: (field: keyof CalendarFormData, value: string) => void;
    submitCreate: () => Promise<void>;
    submitEdit: () => Promise<void>;
    setError: (error: string | null) => void;
}

const initialFormData: CalendarFormData = {
    title: '',
    resolution: '',
    date: new Date().toISOString().split('T')[0],
    pdfUrl: '',
    introduction: '',
    electionId: '',
};

const initialState: CalendarFormState = {
    data: initialFormData,
    showCreateModal: false,
    showEditModal: false,
    creating: false,
    updating: false,
    editingCalendarId: null,
    error: null,
};

function calendarFormReducer(
    state: CalendarFormState,
    action: CalendarFormAction
): CalendarFormState {
    switch (action.type) {
        case 'OPEN_CREATE_MODAL':
            return {
                ...state,
                data: initialFormData,
                showCreateModal: true,
                showEditModal: false,
                error: null,
            };

        case 'OPEN_EDIT_MODAL':
            return {
                ...state,
                data: action.payload.data,
                editingCalendarId: action.payload.id,
                showCreateModal: false,
                showEditModal: true,
                error: null,
            };

        case 'CLOSE_MODAL':
            return {
                ...state,
                data: initialFormData,
                showCreateModal: false,
                showEditModal: false,
                editingCalendarId: null,
                error: null,
            };

        case 'UPDATE_FIELD':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.field]: action.payload.value,
                },
            };

        case 'SET_CREATING':
            return {
                ...state,
                creating: action.payload,
            };

        case 'SET_UPDATING':
            return {
                ...state,
                updating: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        case 'RESET_FORM':
            return {
                ...state,
                data: initialFormData,
                error: null,
            };

        default:
            return state;
    }
}

export const useCalendarForm = (
    onSuccess?: () => void
): UseCalendarFormReturn => {
    const [state, dispatch] = useReducer(calendarFormReducer, initialState);

    const updateFormField = useCallback(
        (field: keyof CalendarFormData, value: string) => {
            dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
        },
        []
    );

    const openCreateModal = useCallback(() => {
        dispatch({ type: 'OPEN_CREATE_MODAL' });
    }, []);

    const openEditModal = useCallback(async (calendarId: string) => {
        try {
            dispatch({ type: 'SET_ERROR', payload: null });
            const response = await getCalendarById(calendarId);
            const calendar = response.data;

            const formData: CalendarFormData = {
                title: calendar.title,
                resolution: calendar.resolution,
                date: new Date(calendar.date).toISOString().split('T')[0],
                pdfUrl: calendar.pdf_url || '',
                introduction: calendar.introduction || '',
                electionId: calendar.election_id,
            };

            dispatch({
                type: 'OPEN_EDIT_MODAL',
                payload: { id: calendarId, data: formData },
            });
        } catch (err) {
            console.error('Error loading calendar:', err);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Error al cargar el calendario',
            });
        }
    }, []);

    const closeModal = useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' });
    }, []);

    const submitCreate = useCallback(async () => {
        try {
            dispatch({ type: 'SET_CREATING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const calendarData: CreateElectoralCalendarData = {
                title: state.data.title,
                resolution: state.data.resolution,
                date: state.data.date,
                pdf_url: state.data.pdfUrl,
                introduction: state.data.introduction,
                election_id: state.data.electionId,
                signatures: [],
                events: [],
            };

            await createCalendar(calendarData);
            dispatch({ type: 'CLOSE_MODAL' });

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error creating calendar:', err);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Error al crear el calendario',
            });
        } finally {
            dispatch({ type: 'SET_CREATING', payload: false });
        }
    }, [state.data, onSuccess]);

    const submitEdit = useCallback(async () => {
        if (!state.editingCalendarId) return;

        try {
            dispatch({ type: 'SET_UPDATING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const updateData: UpdateElectoralCalendarData = {
                title: state.data.title,
                resolution: state.data.resolution,
                date: state.data.date,
                pdf_url: state.data.pdfUrl,
                introduction: state.data.introduction,
                election_id: state.data.electionId,
            };

            await updateCalendar(state.editingCalendarId, updateData);
            dispatch({ type: 'CLOSE_MODAL' });

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error updating calendar:', err);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Error al actualizar el calendario',
            });
        } finally {
            dispatch({ type: 'SET_UPDATING', payload: false });
        }
    }, [state.data, state.editingCalendarId, onSuccess]);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    return {
        data: state.data,
        showCreateModal: state.showCreateModal,
        showEditModal: state.showEditModal,
        creating: state.creating,
        updating: state.updating,
        editingCalendarId: state.editingCalendarId,
        error: state.error,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormField,
        submitCreate,
        submitEdit,
        setError,
    };
};
