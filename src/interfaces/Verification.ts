export interface VerificationTag {
    name: string;
    url: string;
}

export interface Verification {
    _id: string;
    title: string;
    classified_as: string;
    section_url: string;
    summary: string;
    body: string;
    url: string;
    publication_date: string;
    tags: VerificationTag[];
    created_by?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateVerificationPayload {
    title: string;
    summary: string;
    body: string;
    classified_as: string;
    section_url: string;
    url: string;
    publication_date: string;
    tags: VerificationTag[];
}
