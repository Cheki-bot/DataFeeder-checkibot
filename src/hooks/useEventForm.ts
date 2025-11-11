import { useReducer, useCallback } from 'react';
import { getCalendarById, updateCalendar } from '@/services/calendar.service';
import type { ElectoralCalendar } from '@/interfaces/Calendar';

export interface EventFormData {
    scenery: string;
    activity: string;
    from_date: string;
    to_date: string;
    duration: number;
    reference: string;
    place: string;
}

interface EventFormState {
    calendar: ElectoralCalendar | null;
    loading: boolean;
    error: string | null;
    showEventModal: boolean;
    editingEventIndex: number | null;
    eventForm: EventFormData;
    savingEvent: boolean;
}

type EventFormAction =
    | { type: 'SET_CALENDAR'; payload: ElectoralCalendar }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'OPEN_CREATE_EVENT_MODAL' }
    | { type: 'OPEN_EDIT_EVENT_MODAL'; payload: { index: number; data: EventFormData } }
    | { type: 'PREPARE_EDIT_EVENT'; payload: number }
    | { type: 'CLOSE_EVENT_MODAL' }
    | { type: 'UPDATE_EVENT_FIELD'; payload: { field: keyof EventFormData; value: string | number } }
    | { type: 'SET_SAVING_EVENT'; payload: boolean };

interface UseEventFormReturn {
    calendar: ElectoralCalendar | null;
    loading: boolean;
    error: string | null;
    showEventModal: boolean;
    editingEventIndex: number | null;
    eventForm: EventFormData;
    savingEvent: boolean;
    
    fetchCalendar: (id: string) => Promise<void>;
    openCreateEventModal: () => void;
    openEditEventModal: (index: number) => void;
    closeEventModal: () => void;
    updateEventField: (field: keyof EventFormData, value: string | number) => void;
    submitEvent: (calendarId: string) => Promise<void>;
    deleteEvent: (calendarId: string, index: number) => Promise<void>;
    setError: (error: string | null) => void;
}

const initialEventFormData: EventFormData = {
    scenery: '',
    activity: '',
    from_date: '',
    to_date: '',
    duration: 0,
    reference: '',
    place: ''
};

const initialState: EventFormState = {
    calendar: null,
    loading: true,
    error: null,
    showEventModal: false,
    editingEventIndex: null,
    eventForm: initialEventFormData,
    savingEvent: false,
};

function eventFormReducer(state: EventFormState, action: EventFormAction): EventFormState {
    switch (action.type) {
        case 'SET_CALENDAR':
            return {
                ...state,
                calendar: action.payload,
                loading: false,
                error: null,
            };
        
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        
        case 'OPEN_CREATE_EVENT_MODAL':
            return {
                ...state,
                showEventModal: true,
                editingEventIndex: null,
                eventForm: initialEventFormData,
                error: null,
            };
        
        case 'OPEN_EDIT_EVENT_MODAL':
            return {
                ...state,
                showEventModal: true,
                editingEventIndex: action.payload.index,
                eventForm: action.payload.data,
                error: null,
            };
        
        case 'PREPARE_EDIT_EVENT': {
            const event = state.calendar?.events[action.payload];
            if (!event) return state;
            
            const formData: EventFormData = {
                scenery: event.scenery || '',
                activity: event.activity || '',
                from_date: event.from_date ? new Date(event.from_date).toISOString().split('T')[0] : '',
                to_date: event.to_date ? new Date(event.to_date).toISOString().split('T')[0] : '',
                duration: event.duration || 0,
                reference: event.reference || '',
                place: event.place || ''
            };
            
            return {
                ...state,
                showEventModal: true,
                editingEventIndex: action.payload,
                eventForm: formData,
                error: null,
            };
        }
        
        case 'CLOSE_EVENT_MODAL':
            return {
                ...state,
                showEventModal: false,
                editingEventIndex: null,
                eventForm: initialEventFormData,
                error: null,
            };
        
        case 'UPDATE_EVENT_FIELD':
            return {
                ...state,
                eventForm: {
                    ...state.eventForm,
                    [action.payload.field]: action.payload.value,
                },
            };
        
        case 'SET_SAVING_EVENT':
            return {
                ...state,
                savingEvent: action.payload,
            };
        
        default:
            return state;
    }
}

export const useEventForm = (): UseEventFormReturn => {
    const [state, dispatch] = useReducer(eventFormReducer, initialState);

    const fetchCalendar = useCallback(async (id: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await getCalendarById(id);
            dispatch({ type: 'SET_CALENDAR', payload: response.data });
        } catch (err) {
            console.error('Error fetching calendar:', err);
            dispatch({ type: 'SET_ERROR', payload: 'Error al cargar el calendario' });
        }
    }, []);

    const openCreateEventModal = useCallback(() => {
        dispatch({ type: 'OPEN_CREATE_EVENT_MODAL' });
    }, []);

    const openEditEventModal = useCallback((index: number) => {
        dispatch({ type: 'PREPARE_EDIT_EVENT', payload: index });
    }, []);

    const closeEventModal = useCallback(() => {
        dispatch({ type: 'CLOSE_EVENT_MODAL' });
    }, []);

    const updateEventField = useCallback((field: keyof EventFormData, value: string | number) => {
        dispatch({ type: 'UPDATE_EVENT_FIELD', payload: { field, value } });
    }, []);

    const submitEvent = useCallback(async (calendarId: string) => {
        if (!state.calendar) return;

        try {
            dispatch({ type: 'SET_SAVING_EVENT', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const newEvent = {
                scenery: state.eventForm.scenery,
                activity: state.eventForm.activity,
                from_date: state.eventForm.from_date ? new Date(state.eventForm.from_date) : undefined,
                to_date: state.eventForm.to_date ? new Date(state.eventForm.to_date) : undefined,
                duration: state.eventForm.duration,
                reference: state.eventForm.reference,
                place: state.eventForm.place
            };

            let updatedEvents = [...(state.calendar.events || [])];
            
            if (state.editingEventIndex !== null) {
                updatedEvents[state.editingEventIndex] = newEvent;
            } else {
                updatedEvents.push(newEvent);
            }

            updatedEvents = updatedEvents.map((event, index) => ({
                ...event,
                no: index + 1
            }));

            const response = await updateCalendar(calendarId, { events: updatedEvents });
            dispatch({ type: 'SET_CALENDAR', payload: response.data });
            dispatch({ type: 'CLOSE_EVENT_MODAL' });
        } catch (err) {
            console.error('Error updating events:', err);
            dispatch({ type: 'SET_ERROR', payload: 'Error al guardar el evento' });
        } finally {
            dispatch({ type: 'SET_SAVING_EVENT', payload: false });
        }
    }, [state.calendar, state.eventForm, state.editingEventIndex]);

    const deleteEvent = useCallback(async (calendarId: string, index: number) => {
        if (!state.calendar) return;
        
        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            return;
        }

        try {
            dispatch({ type: 'SET_ERROR', payload: null });
            
            let updatedEvents = state.calendar.events.filter((_, i) => i !== index);
            
            updatedEvents = updatedEvents.map((event, idx) => ({
                ...event,
                no: idx + 1
            }));

            const response = await updateCalendar(calendarId, { events: updatedEvents });
            dispatch({ type: 'SET_CALENDAR', payload: response.data });
        } catch (err) {
            console.error('Error deleting event:', err);
            dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar el evento' });
        }
    }, [state.calendar]);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    return {
        calendar: state.calendar,
        loading: state.loading,
        error: state.error,
        showEventModal: state.showEventModal,
        editingEventIndex: state.editingEventIndex,
        eventForm: state.eventForm,
        savingEvent: state.savingEvent,
        fetchCalendar,
        openCreateEventModal,
        openEditEventModal,
        closeEventModal,
        updateEventField,
        submitEvent,
        deleteEvent,
        setError,
    };
};
