import { z } from 'zod';

export const tagSchema = z.object({
    name: z.string().min(1, 'El nombre de la etiqueta es obligatorio'),
    url: z
        .string()
        .trim()
        .refine(
            (value) => {
                if (!value) return false;
                try {
                    new URL(value);
                    return true;
                } catch {
                    // dominio.tld con path opcional
                    const domainLikeRegex =
                        /^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/\S*)?$/i;
                    return domainLikeRegex.test(value);
                }
            },
            {
                message:
                    'La URL de la etiqueta no es válida (use https:// o dominio.tld)',
            }
        ),
});

export const verificationSchema = z.object({
    title: z
        .string()
        .min(10, 'El título debe tener al menos 10 caracteres')
        .max(500, 'El título no debe superar 500 caracteres'),
    summary: z.string().min(3, 'El resumen es obligatorio'),
    body: z.string().min(20, 'El cuerpo es obligatorio'),
    classification: z.string().min(3, 'La clasificación es obligatoria'),
    sectionUrl: z
        .string()
        .trim()
        .refine(
            (value) => {
                if (!value) return false;
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
                message:
                    'La URL de la sección no es válida. Debe incluir https:// o un dominio como dominio.tld',
            }
        ),
    url: z
        .string()
        .trim()
        .refine(
            (value) => {
                if (!value) return false;
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
                message:
                    'La URL no es válida. Debe incluir https:// o un dominio como dominio.tld',
            }
        ),
    publicationDate: z
        .string()
        .min(1, 'La fecha de publicación es obligatoria'),
    tags: z.array(tagSchema).min(1, 'Agrega al menos una etiqueta'),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;
