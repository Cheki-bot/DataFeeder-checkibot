import { useState } from 'react';
import type { CreateElectoralCalendarData, UpdateElectoralCalendarData } from '@/interfaces/Calendar';
import { createCalendar, updateCalendar, getCalendarById } from '@/services/calendar.service';

interface CalendarFormData {
    title: string;
    resolution: string;
    date: string;
    pdfUrl: string;
    introduction: string;
    electionId: string;
}

interface UseCalendarFormReturn {
    formData: CalendarFormData;    
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

export const useCalendarForm = (onSuccess?: () => void): UseCalendarFormReturn => {
    const [formData, setFormData] = useState<CalendarFormData>(initialFormData);
    const [modalState, setModalState] = useState({
        showCreate: false,
        showEdit: false,
    });
    const [loadingState, setLoadingState] = useState({
        creating: false,
        updating: false,
    });
    const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const updateFormField = (field: keyof CalendarFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setError(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalState({ showCreate: true, showEdit: false });
    };

    const openEditModal = async (calendarId: string) => {
        try {
            setError(null);
            const response = await getCalendarById(calendarId);
            const calendar = response.data;
            
            setFormData({
                title: calendar.title,
                resolution: calendar.resolution,
                date: new Date(calendar.date).toISOString().split('T')[0],
                pdfUrl: calendar.pdf_url || '',
                introduction: calendar.introduction || '',
                electionId: calendar.election_id,
            });
            
            setEditingCalendarId(calendarId);
            setModalState({ showCreate: false, showEdit: true });
        } catch (err) {
            console.error('Error loading calendar:', err);
            setError('Error al cargar el calendario');
        }
    };

    const closeModal = () => {
        setModalState({ showCreate: false, showEdit: false });
        setEditingCalendarId(null);
        resetForm();
    };

    const submitCreate = async () => {
        try {
            setLoadingState(prev => ({ ...prev, creating: true }));
            setError(null);
            
            const calendarData: CreateElectoralCalendarData = {
                title: formData.title,
                resolution: formData.resolution,
                date: formData.date,
                pdf_url: formData.pdfUrl,
                introduction: formData.introduction,
                election_id: formData.electionId,
                signatures: [],
                events: [],
            };

            await createCalendar(calendarData);
            closeModal();
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error creating calendar:', err);
            setError('Error al crear el calendario');
        } finally {
            setLoadingState(prev => ({ ...prev, creating: false }));
        }
    };

    const submitEdit = async () => {
        if (!editingCalendarId) return;
        
        try {
            setLoadingState(prev => ({ ...prev, updating: true }));
            setError(null);
            
            const updateData: UpdateElectoralCalendarData = {
                title: formData.title,
                resolution: formData.resolution,
                date: formData.date,
                pdf_url: formData.pdfUrl,
                introduction: formData.introduction,
                election_id: formData.electionId,
            };

            await updateCalendar(editingCalendarId, updateData);
            closeModal();
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error updating calendar:', err);
            setError('Error al actualizar el calendario');
        } finally {
            setLoadingState(prev => ({ ...prev, updating: false }));
        }
    };

    return {
        formData,
        showCreateModal: modalState.showCreate,
        showEditModal: modalState.showEdit,
        creating: loadingState.creating,
        updating: loadingState.updating,
        editingCalendarId,
        error,
        openCreateModal,
        openEditModal,
        closeModal,
        updateFormField,
        submitCreate,
        submitEdit,
        setError,
    };
};
