import { api } from './api.service';

export const getCandidatesByPartyId = async (partyId: string) => {
    const response = await api.get(`/candidates/${partyId}`);
    return response.data;
};
