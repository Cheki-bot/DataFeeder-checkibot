import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	ButtonComponent,
	InputComponent,
	ModalComponent,
	NotificationContainer,
} from '@/components';
import { useNotification } from '@/hooks/useNotification';
import type { ProfileData } from '@/interfaces/Auth';
import { changePassword, getProfile } from '@/services/auth.service';

import styles from './Profile.module.css';

const changePasswordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, 'La contraseña actual es requerida'),
		newPassword: z
			.string()
			.min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
		confirmPassword: z
			.string()
			.min(1, 'La confirmación es requerida'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const Profile = () => {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [profileError, setProfileError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const { notifications, addNotification, removeNotification } =
		useNotification();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		resetField,
		formState: { errors },
	} = useForm<ChangePasswordForm>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const loadProfile = useCallback(async () => {
		setLoading(true);
		setProfileError(null);
		try {
			const response = await getProfile();
			setProfile(response.data);
		} catch (error) {
			console.error('Error loading profile:', error);
			setProfileError('No se pudo cargar el perfil.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		if (isSaving) return;
		setIsModalOpen(false);
		reset();
	};

	const onSubmit = async (data: ChangePasswordForm) => {
		if (isSaving) return;
		setIsSaving(true);
		try {
			await changePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			});
			addNotification('Contraseña actualizada correctamente', 'success');
			setIsModalOpen(false);
			reset();
		} catch (error) {
			console.error('Error updating password:', error);
			addNotification('No se pudo actualizar la contraseña', 'error');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={styles.page}>
			<NotificationContainer
				notifications={notifications}
				onClose={removeNotification}
			/>
			<div className={styles.header}>
				<h2>Perfil</h2>
			</div>

			<div className={styles.card}>
				<div className={styles.infoRow}>
					<span className={styles.label}>Nombre</span>
					<span className={styles.value}>
						{loading ? 'Cargando...' : profile?.name ?? '-'}
					</span>
				</div>
				<div className={styles.infoRow}>
					<span className={styles.label}>Correo</span>
					<span className={styles.value}>
						{loading ? 'Cargando...' : profile?.email ?? '-'}
					</span>
				</div>
			</div>

			{profileError && (
				<p className={styles.error}>{profileError}</p>
			)}

			<div className={styles.actions}>
				<ButtonComponent
					label="Cambiar contraseña"
					onClick={openModal}
				/>
			</div>

			<ModalComponent
				isOpen={isModalOpen}
				onClose={closeModal}
				Accept={handleSubmit(onSubmit)}
				acceptLabel="Guardar"
				isLoading={isSaving}
			>
				<div className={styles.modalContent}>
					<h3 className={styles.modalTitle}>
						Actualizar contraseña
					</h3>
					<p className={styles.modalText}>
						Usa una contraseña segura y no la reutilices.
					</p>
					<form
						className={styles.form}
						onSubmit={handleSubmit(onSubmit)}
						noValidate
					>
						<InputComponent
							label="Contraseña actual"
							type="password"
							value={watch('currentPassword')}
							validationProps={register('currentPassword')}
							errors={errors.currentPassword}
							onClear={() => resetField('currentPassword')}
						/>
						<InputComponent
							label="Nueva contraseña"
							type="password"
							value={watch('newPassword')}
							validationProps={register('newPassword')}
							errors={errors.newPassword}
							onClear={() => resetField('newPassword')}
						/>
						<InputComponent
							label="Confirmar contraseña"
							type="password"
							value={watch('confirmPassword')}
							validationProps={register('confirmPassword')}
							errors={errors.confirmPassword}
							onClear={() => resetField('confirmPassword')}
						/>
					</form>
				</div>
			</ModalComponent>
		</div>
	);
};
