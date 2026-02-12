import { z } from 'zod';

export const calendarSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    resolution: z.string().min(1, 'La resolución es obligatoria'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Fecha inválida',
    }),
    electionId: z
        .string()
        .min(1, 'El ID de la elección es obligatorio')
        .regex(/^[A-Z0-9-]+$/, 'Solo se permiten mayúsculas, números y guiones'),
    pdfUrl: z.string().url('Debe ser una URL válida'),
    introduction: z.string().optional(),
});

export type CalendarFormData = z.infer<typeof calendarSchema>;
