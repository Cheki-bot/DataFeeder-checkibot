import type { ICandidacy, IPoliticalParty } from '@/interfaces/Candidacies';
import { api } from '@/services/api.service';

interface data {
    data: IPoliticalParty[];
}

export const getCandidacies = async (): Promise<data> => {
    try {
        const response = await api.get('/political-parties');
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching candidacies:', error);
        throw error;
    }
};

export const createCandidacy = async (
    candidacy: ICandidacy
): Promise<ICandidacy> => {
    try {
        const response = await api.post<ICandidacy>('/political-parties', candidacy);
        return response.data;
    } catch (error) {
        console.error('Error creating candidacy:', error);
        throw error;
    }
};

export const deleteCandidacy = async (id: string): Promise<void> => {
    try {
        await api.delete(`/political-parties/${id}`);
    } catch (error) {
        console.error('Error deleting candidacy:', error);
        throw error;
    }
};

export const updateCandidacy = async (
    id: string,
    candidacy: Partial<ICandidacy>
): Promise<ICandidacy> => {
    try {
        const response = await api.put<ICandidacy>(
            `/political-parties/${id}`,
            candidacy
        );
        return response.data;
    } catch (error) {
        console.error('Error updating candidacy:', error);
        throw error;
    }
};

export const getCandidacyById = async (id: string): Promise<ICandidacy> => {
    try {
        const response = await api.get<ICandidacy>(`/political-parties/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching candidacy by ID:', error);
        throw error;
    }
};
