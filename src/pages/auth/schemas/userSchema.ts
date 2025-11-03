import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'El nombre de usuario es obligatorio'),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z
    .object({
        username: z.string().min(1, 'El nombre de usuario es obligatorio'),
        email: z.string().email('Correo electrónico inválido'),
        password: z
            .string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z
            .string()
            .min(6, 'La confirmación de la contraseña es obligatoria'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });


export type UserFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;