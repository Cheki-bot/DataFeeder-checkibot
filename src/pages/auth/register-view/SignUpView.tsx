import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../schemas/userSchema';

import { ButtonComponent, InputComponent } from '@components/index';

import style from './SignUpView.module.css';

export const SignUpView = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        resetField,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        console.log(data);
        reset();
    };

    return (
        <div className={style.login}>
            <section className={style.imageSection}>
                <img
                    className={style.image}
                    src="https://picsum.photos/2000/3000/?random"
                    alt="Chequea Bolivia Image"
                />
                <span className={style.imageOverlay}>
                    <img
                        className={style.imageLogo}
                        src="/Logo_ChequeaBolivia.png"
                        alt="Logo Chequea Bolivia"
                    />
                </span>
            </section>
            <section className={style.loginSection}>
                <div className={style.form}>
                    <h2>Registrate</h2>
                    <InputComponent
                        label="Nombre de usuario"
                        type="text"
                        value={watch('username') || ''}
                        validationProps={register('username')}
                        errors={errors.username}
                        onClear={() => {
                            resetField('username');
                        }}
                    />
                    <InputComponent
                        label="Correo electrónico"
                        type="text"
                        value={watch('email') || ''}
                        validationProps={register('email')}
                        errors={errors.email}
                        onClear={() => {
                            resetField('email');
                        }}
                    />
                    <InputComponent
                        label="Contraseña"
                        type="password"
                        value={watch('password') || ''}
                        validationProps={register('password')}
                        errors={errors.password}
                        onClear={() => {
                            resetField('password');
                        }}
                    />
                    <InputComponent
                        label="Confirmar contraseña"
                        type="password"
                        value={watch('confirmPassword') || ''}
                        validationProps={register('confirmPassword')}
                        errors={errors.confirmPassword}
                        onClear={() => {
                            resetField('confirmPassword');
                        }}
                    />
                    <ButtonComponent
                        label="Ingresar"
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </section>
        </div>
    );
};
