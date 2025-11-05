import type { CreateElectoralCalendarData, ElectoralCalendar, UpdateElectoralCalendarData } from "@/interfaces/Calendar";
import { api } from "./api.service";

export interface CalendarFilters {
  election_id?: string;
}

/**
 * Get all electoral calendars with optional filters
 */
export const getAllCalendars = async (filters?: CalendarFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.election_id) {
    params.append('election_id', filters.election_id);
  }

  const response = await api.get<{ 
    message: string; 
    ok: boolean; 
    status: number; 
    data: ElectoralCalendar[] 
  }>(`/calendars?${params.toString()}`);
  
  console.log("Calendars response:", response);
  return response.data;
};

/**
 * Get a single electoral calendar by ID
 */
export const getCalendarById = async (id: string) => {
  const response = await api.get<{ 
    message: string; 
    ok: boolean; 
    status: number; 
    data: ElectoralCalendar 
  }>(`/calendars/${id}`);
  
  console.log("Calendar by ID response:", response);
  return response.data;
};

/**
 * Create a new electoral calendar
 */
export const createCalendar = async (calendarData: CreateElectoralCalendarData) => {
  const response = await api.post<{ 
    message: string; 
    ok: boolean; 
    status: number; 
    data: ElectoralCalendar 
  }>('/calendars', calendarData);
  
  console.log("Create calendar response:", response);
  return response.data;
};

/**
 * Update an existing electoral calendar
 */
export const updateCalendar = async (id: string, updateData: UpdateElectoralCalendarData) => {
  const response = await api.patch<{ 
    message: string; 
    ok: boolean; 
    status: number; 
    data: ElectoralCalendar 
  }>(`/calendars/${id}`, updateData);
  
  console.log("Update calendar response:", response);
  return response.data;
};

/**
 * Delete an electoral calendar
 */
export const deleteCalendar = async (id: string) => {
  const response = await api.delete<{ 
    message: string; 
    ok: boolean; 
    status: number; 
  }>(`/calendars/${id}`);
  
  console.log("Delete calendar response:", response);
  return response.data;
};
