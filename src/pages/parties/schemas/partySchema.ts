import { z } from 'zod';

export const partySchema = z.object({
    name: z
        .string()
        .min(3, 'El nombre del partido es obligatorio (mínimo 3 caracteres)'),
    sigla: z
        .string()
        .min(1, 'La sigla es obligatoria')
        .max(10, 'La sigla no debe superar 10 caracteres'),
    description: z.string().optional(),
    logoUrl: z
        .string()
        .trim()
        .optional()
        .refine(
            (value) => {
                if (!value) return true;
                try {
                    new URL(value);
                    return true;
                } catch {
                    const domainLikeRegex =
                        /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/\S*)?$/i;
                    return domainLikeRegex.test(value);
                }
            },
            {
                message: 'La URL del logo no es válida',
            }
        ),
    founded: z.string().optional(),
});

export type PartyFormData = z.infer<typeof partySchema>;
