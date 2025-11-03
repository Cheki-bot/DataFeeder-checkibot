import { z } from 'zod';

const username = z
    .string()
    .min(3, 'El nombre de usuario es obligatorio')
    .max(20, 'El nombre de usuario no debe exceder los 20 caracteres')
    .regex(
        /^[a-zA-Z0-9_]+$/,
        'El nombre de usuario solo puede contener letras, números y guiones bajos'
    );

const password = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no debe exceder los 72 caracteres');
    
const email = z.string().email('Correo electrónico inválido');

export const loginSchema = z.object({
    email,
    password,
});

export const registerSchema = z
    .object({
        username,
        email,
        password,
        confirmPassword: password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type UserFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
