import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useNotification } from '@/hooks/useNotification';
import type { IUser, CreateUserData, UpdateUserData } from '@/interfaces/User';

import {
    ButtonComponent,
    ModalComponent,
    NotificationContainer,
    TableComponent,
    type TableColumn,
    type TableAction,
} from '@/components';
import { UserForm, type UserFormHandle } from './components/UserForm';

import styles from './UsersView.module.css';

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const columns: TableColumn<IUser>[] = [
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
        key: 'role',
        header: 'Rol',
        render: (user: IUser) => (user.role === 'admin' ? 'Admin' : 'Empleado'),
    },
    {
        key: 'is_active',
        header: 'Estado',
        render: (user: IUser) => (user.is_active ? 'Activo' : 'Inactivo'),
    },
    {
        key: 'created_at',
        header: 'Creado',
        render: (user: IUser) => formatDate(user.created_at),
    },
];

export const UsersView = () => {
    const { user: authUser, isLoading: authLoading } = useAuth();
    const {
        users,
        loading,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleToggleActive,
    } = useUsers();
    const { notifications, addNotification, removeNotification } = useNotification();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const formRef = useRef<UserFormHandle>(null);

    if (authLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                Cargando...
            </div>
        );
    }

    if (authUser?.role !== 'admin') {
        return (
            <div className={styles.accessDenied}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0112 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0112 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                        fill="currentColor"
                    />
                </svg>
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos para acceder a esta sección. Se requiere rol de administrador.</p>
            </div>
        );
    }

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const openEditModal = (user: IUser) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const closeFormModal = () => {
        setIsFormOpen(false);
        setSelectedUser(null);
    };

    const openDeleteConfirm = (user: IUser) => {
        setUserToDelete(user);
        setIsDeleteOpen(true);
    };

    const closeDeleteConfirm = () => {
        setIsDeleteOpen(false);
        setUserToDelete(null);
    };

    const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
        try {
            if (selectedUser) {
                await handleUpdate(selectedUser._id, data as UpdateUserData);
                addNotification('Usuario actualizado correctamente', 'success');
            } else {
                await handleCreate(data as CreateUserData);
                addNotification('Usuario creado correctamente', 'success');
            }
            closeFormModal();
        } catch {
            addNotification(
                selectedUser ? 'Error al actualizar usuario' : 'Error al crear usuario',
                'error'
            );
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await handleDelete(userToDelete._id);
            addNotification('Usuario eliminado correctamente', 'success');
            closeDeleteConfirm();
        } catch {
            addNotification('Error al eliminar el usuario', 'error');
        }
    };

    const onToggleActive = async (user: IUser) => {
        try {
            await handleToggleActive(user);
            addNotification(
                `Usuario ${user.is_active ? 'desactivado' : 'activado'} correctamente`,
                'success'
            );
        } catch {
            addNotification('Error al cambiar el estado del usuario', 'error');
        }
    };

    const actions: TableAction<IUser>[] = [
        {
            label: 'Editar',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        fill="currentColor"
                    />
                </svg>
            ),
            onClick: openEditModal,
        },
        {
            label: 'Desactivar',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31A7.902 7.902 0 0112 20zm6.31-3.1L7.1 5.69A7.902 7.902 0 0112 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                        fill="currentColor"
                    />
                </svg>
            ),
            variant: 'warning',
            onClick: onToggleActive,
            hidden: (user: IUser) => !user.is_active,
        },
        {
            label: 'Activar',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                        fill="currentColor"
                    />
                </svg>
            ),
            variant: 'success',
            onClick: onToggleActive,
            hidden: (user: IUser) => user.is_active,
        },
        {
            label: 'Eliminar',
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="currentColor"
                    />
                </svg>
            ),
            variant: 'danger',
            onClick: openDeleteConfirm,
        },
    ];

    return (
        <div className={styles.container}>
            <NotificationContainer
                notifications={notifications}
                onClose={removeNotification}
            />

            {/* Header */}
            <div className={styles.header}>
                <h1>Gestión de Usuarios</h1>
                <ButtonComponent label="Agregar usuario" onClick={openCreateModal} />
            </div>

            {/* Table */}
            <TableComponent<IUser>
                columns={columns}
                data={users}
                keyExtractor={(user) => user._id}
                actions={actions}
                loading={loading}
                loadingMessage="Cargando usuarios..."
                emptyMessage="No hay usuarios registrados."
            />

            {/* Create/Edit Modal */}
            <ModalComponent
                isOpen={isFormOpen}
                onClose={closeFormModal}
                Accept={() => formRef.current?.submit()}
                acceptLabel={selectedUser ? 'Guardar cambios' : 'Crear usuario'}
                isLoading={loading}
            >
                <UserForm
                    ref={formRef}
                    user={selectedUser}
                    onSubmit={handleFormSubmit}
                    isLoading={loading}
                />
            </ModalComponent>

            {/* Delete Confirmation Modal */}
            <ModalComponent
                isOpen={isDeleteOpen}
                onClose={closeDeleteConfirm}
                Accept={confirmDelete}
                acceptLabel="Eliminar"
                isLoading={loading}
            >
                <div className={styles.confirmContent}>
                    <h3>¿Eliminar usuario?</h3>
                    <p>
                        Estás a punto de eliminar al usuario{' '}
                        <span className={styles.confirmUser}>
                            {userToDelete?.username}
                        </span>
                        . Esta acción no se puede deshacer.
                    </p>
                </div>
            </ModalComponent>
        </div>
    );
};
