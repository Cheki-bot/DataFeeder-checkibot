import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { IUser, CreateUserData, UpdateUserData } from '@/interfaces/User';
import { InputComponent, SelectInputComponent } from '@/components';
import styles from './UserForm.module.css';

export interface UserFormHandle {
    submit: () => void;
}

interface UserFormProps {
    user?: IUser | null;
    onSubmit: (data: CreateUserData | UpdateUserData) => void;
    isLoading?: boolean;
}

export const UserForm = forwardRef<UserFormHandle, UserFormProps>(
    ({ user, onSubmit, isLoading = false }, ref) => {
    const isEditing = !!user;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'employee' as 'admin' | 'employee',
        is_active: true,
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
                password: '',
            });
        } else {
            setFormData({
                username: '',
                email: '',
                role: 'employee',
                is_active: true,
                password: '',
            });
        }
        setErrors({});
    }, [user]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!isEditing && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.trim() && formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, role: e.target.value as 'admin' | 'employee' }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
    };

    const toFieldError = (field: string) => {
        return errors[field] ? { message: errors[field], type: 'manual' as const } : undefined;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        if (isEditing) {
            const updateData: UpdateUserData = {
                username: formData.username,
                email: formData.email,
                role: formData.role,
                is_active: formData.is_active,
                ...(formData.password.trim() && { password: formData.password }),
            };
            onSubmit(updateData);
        } else {
            onSubmit(formData as CreateUserData);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
    }));

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>
                {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
            </h2>

            <div className={styles.formRow}>
                <InputComponent
                    type="text"
                    label="Nombre de usuario"
                    placeholder="Ingrese nombre de usuario"
                    value={formData.username}
                    name="username"
                    validationProps={{ onChange: handleFieldChange('username'), disabled: isLoading }}
                    errors={toFieldError('username')}
                />

                <InputComponent
                    type="email"
                    label="Email"
                    placeholder="Ingrese email"
                    value={formData.email}
                    name="email"
                    validationProps={{ onChange: handleFieldChange('email'), disabled: isLoading }}
                    errors={toFieldError('email')}
                />
            </div>

            <div className={styles.formRow}>
                <SelectInputComponent
                    label="Rol"
                    name="role"
                    value={formData.role}
                    options={[
                        { label: 'Empleado', value: 'employee' },
                        { label: 'Administrador', value: 'admin' },
                    ]}
                    onChange={handleSelectChange}
                    disabled={isLoading}
                />

                <InputComponent
                    type="password"
                    label="Contraseña"
                    placeholder={isEditing ? '••••••••' : 'Ingrese contraseña'}
                    value={formData.password}
                    name="password"
                    validationProps={{ onChange: handleFieldChange('password'), disabled: isLoading }}
                    errors={toFieldError('password')}
                />
            </div>

            <div className={styles.checkboxGroup}>
                <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.is_active}
                    onChange={handleCheckboxChange}
                    disabled={isLoading}
                />
                <label className={styles.checkboxLabel} htmlFor="is_active">
                    Usuario activo
                </label>
            </div>
        </div>
    );
});

UserForm.displayName = 'UserForm';
