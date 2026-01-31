export interface CalendarSignature {
    full_name: string;
    position: string;
}

export interface CalendarEvent {
    _id?: string;
    scenery?: string;
    no?: number;
    activity?: string;
    days?: number;
    from_date?: Date;
    to_date?: Date;
    duration?: number;
    reference?: string;
    place?: string;
    calendar_id?: string;
}

export interface ElectoralCalendar {
    _id: string;
    pdf_url: string;
    title: string;
    resolution: string;
    date: Date;
    introduction?: string;
    signatures: CalendarSignature[];
    events: CalendarEvent[];
    election_id: string;
    created_by?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateElectoralCalendarData {
    pdf_url: string;
    title: string;
    resolution: string;
    date: Date | string;
    introduction?: string;
    signatures: CalendarSignature[];
    events: CalendarEvent[];
    election_id: string;
}

export interface UpdateElectoralCalendarData {
    pdf_url?: string;
    title?: string;
    resolution?: string;
    date?: Date | string;
    introduction?: string;
    signatures?: CalendarSignature[];
    events?: CalendarEvent[];
    election_id?: string;
}
