import { api } from '../../../services/api.service';
import type {
    CreateVerificationPayload,
    Verification,
} from '@/interfaces/Verification';

export const getVerifications = async (): Promise<Verification[]> => {
    const { data } = await api.get('/verifications');
    if (Array.isArray(data)) {
        return data as Verification[];
    }
    if (data && typeof data === 'object') {
        const nested = (data as { data?: unknown }).data;
        if (Array.isArray(nested)) {
            return nested as Verification[];
        }
    }
    return [];
};

export const createVerification = async (
    payload: CreateVerificationPayload
): Promise<Verification> => {
    const { data } = await api.post('/verifications', payload);
    if (Array.isArray(data) && data.length > 0) {
        return data[0] as Verification;
    }
    if (data && typeof data === 'object') {
        const nested = (data as { data?: unknown }).data;
        if (nested && typeof nested === 'object') {
            return nested as Verification;
        }
    }
    return data as Verification;
};

export const deleteVerification = async (id: string): Promise<void> => {
    await api.delete(`/verifications/${id}`);
};
