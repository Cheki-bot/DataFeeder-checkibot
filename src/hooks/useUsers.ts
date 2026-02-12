import { useState, useCallback, useEffect } from 'react';
import type { IUser, CreateUserData, UpdateUserData } from '@/interfaces/User';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
} from '@/services/users.service';

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch {
            setError('Error al obtener los usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreate = useCallback(async (data: CreateUserData) => {
        setLoading(true);
        setError(null);
        try {
            await createUser(data);
            await fetchUsers();
        } catch {
            setError('Error al crear el usuario');
            throw new Error('Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const handleUpdate = useCallback(async (id: string, data: UpdateUserData) => {
        setLoading(true);
        setError(null);
        try {
            await updateUser(id, data);
            await fetchUsers();
        } catch {
            setError('Error al actualizar el usuario');
            throw new Error('Error al actualizar el usuario');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const handleDelete = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch {
            setError('Error al eliminar el usuario');
            throw new Error('Error al eliminar el usuario');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleActive = useCallback(async (user: IUser) => {
        setLoading(true);
        setError(null);
        try {
            if (user.is_active) {
                await deactivateUser(user._id);
            } else {
                await activateUser(user._id);
            }
            await fetchUsers();
        } catch {
            setError('Error al cambiar el estado del usuario');
            throw new Error('Error al cambiar el estado del usuario');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleToggleActive,
    };
};
