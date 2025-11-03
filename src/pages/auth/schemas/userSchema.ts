import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(72, 'La contraseña no debe exceder los 72 caracteres'),
});

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, 'El nombre de usuario es obligatorio')
            .max(30, 'El nombre de usuario no debe exceder los 30 caracteres')
            .regex(
                /^[a-zA-Z0-9_]+$/,
                'El nombre de usuario solo puede contener letras, números y guiones bajos'
            ),
        email: z.string().email('Correo electrónico inválido'),
        password: z
            .string()
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
            .max(72, 'La contraseña no debe exceder los 72 caracteres'),
        confirmPassword: z
            .string()
            .min(8, 'La confirmación de la contraseña es obligatoria')
            .max(
                72,
                'La confirmación de la contraseña no debe exceder los 72 caracteres'
            ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type UserFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
