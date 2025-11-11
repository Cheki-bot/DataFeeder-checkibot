import { z } from 'zod';

export const QuestionsAnswersSchema = z.object({
    question: z.string().min(3, 'La pregunta es obligatoria'),
    answer: z.string().min(3, 'La respuesta es obligatoria'),
    isActive: z.boolean(),
});
