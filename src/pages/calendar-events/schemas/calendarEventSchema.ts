import { z } from 'zod';

export const calendarEventSchema = z
    .object({
        scenery: z.string().min(1, 'Escenario requerido'),
        no: z
            .number()
            .int('Debe ser entero')
            .min(1, 'Debe ser mayor o igual a 1'),
        activity: z.string().min(1, 'Actividad requerida'),
        days: z.number().int('Debe ser entero').min(0, 'No puede ser negativo'),
        from_date: z
            .string()
            .min(1, 'Fecha de inicio requerida')
            .refine((v) => !Number.isNaN(Date.parse(v)), 'Fecha inválida'),
        to_date: z
            .string()
            .min(1, 'Fecha fin requerida')
            .refine((v) => !Number.isNaN(Date.parse(v)), 'Fecha inválida'),
        duration: z
            .number()
            .int('Debe ser entero')
            .min(1, 'Debe ser al menos 1'),
        reference: z.string().min(1, 'Referencia requerida'),
        place: z.string().min(1, 'Lugar requerido'),
        calendar_id: z.string().min(1, 'ID de calendario requerido'),
    })
    .refine((data) => new Date(data.to_date) >= new Date(data.from_date), {
        path: ['to_date'],
        message: 'La fecha fin debe ser posterior o igual a la de inicio',
    });

export type CalendarEventPayload = z.infer<typeof calendarEventSchema>;
