
export enum CandidacyStatus {
  ACTIVE = 'habilitado',
  INACTIVE = 'inhabilitado',
  WITHDRAWN = 'se retiró',
}

export interface Candidate {
  id?: string;
  full_name: string;
  position: string;
  is_active: boolean;
}


export interface IPoliticalParty {
  id?: string;
  name: string;
  sigla: string;
  description?: string;
  logoUrl?: string;
  founded?: string;
}

export interface ICandidacy {
  _id?: object;
  party: IPoliticalParty;
  candidates: Candidate[];
  status: CandidacyStatus;
  government_plan: string;
  election_id: string;
}
