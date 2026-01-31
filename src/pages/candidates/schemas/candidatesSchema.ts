import { z } from 'zod';

export const candidateSchema = z.object({
    full_name: z.string().min(3, 'El nombre es obligatorio'),
    position: z.string().min(3, 'La posición es obligatoria'),
    isActive: z.boolean(),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
