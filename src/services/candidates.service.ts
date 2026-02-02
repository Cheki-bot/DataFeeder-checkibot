import { api } from './api.service';

export const getCandidatesByPartyId = async (partyId: string) => {
    const response = await api.get(`/candidates/${partyId}`);
    return response.data;
};

export const createCandidate = async (candidateData: {
    full_name: string;
    position: string;
    is_active: boolean;
    candidacyId: string;
}) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
};

export const deleteCandidate = async (
    candidacyId: string,
    candidateName: string
) => {
    const response = await api.delete('/candidates/remove', {
        data: {
            candidacyId,
            candidateName,
        },
    });
    return response.data;
};