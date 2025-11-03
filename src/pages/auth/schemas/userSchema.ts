import { z } from 'zod';

const username = z.string().min(1, 'El nombre de usuario es obligatorio');
const password = z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres');

export const loginSchema = z.object({
    username,
    password,
});

export const registerSchema = z
    .object({
        username,
        email: z.string().email('Correo electrónico inválido'),
        password,
        confirmPassword: password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type UserFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
