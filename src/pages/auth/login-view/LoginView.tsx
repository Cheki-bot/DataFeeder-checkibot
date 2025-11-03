import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type UserFormData } from '../schemas/userSchema';

import { ButtonComponent, InputComponent } from '@components/index';

import style from './LoginView.module.css';

export const LoginView = () => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        resetField,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: UserFormData) => {
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
                    <h2>Iniciar sesión</h2>
                    <InputComponent
                        label="Usuario"
                        type="text"
                        value={watch('username') || ''}
                        validationProps={register('username')}
                        errors={errors.username}
                        onClear={() => {resetField('username')}}
                    />
                    <InputComponent
                        label="Contraseña"
                        type="password"
                        value={watch('password') || ''}
                        validationProps={register('password')}
                        errors={errors.password}
                        onClear={() => {resetField('password')}}
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
