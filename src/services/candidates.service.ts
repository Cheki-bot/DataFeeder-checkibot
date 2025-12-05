import { api } from './api.service';

export const getCandidatesByPartyId = async (partyId: string) => {
    const response = await api.get(`/candidates/${partyId}`);
    console.log(response.data);
    return response.data;
};