import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type UserFormData } from '../schemas/userSchema';
import { ButtonComponent, InputComponent } from '@components/index';
import style from './LoginView.module.css';
import { useAuth } from '../../../contexts/auth-context/useAuth';
import { useEffect } from 'react';

export const LoginView = () => {
    const { login, isAuthenticated } = useAuth();

    const navigate = useNavigate();
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

    useEffect(() => {
        if (isAuthenticated) {
            reset();
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate, reset]);

    const onSubmit = async (data: UserFormData) => {
        try {
            await login(data);
        } catch (error) {
            console.error(error);
        }
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
                    <p className={style.imageText}>
                        Plataforma para la verificación y actualización de datos en
                        tiempo real para el sistema CheckiBot
                    </p>
                </span>
            </section>
            <section className={style.loginSection}>
                <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
                    <h2>Iniciar sesión</h2>
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
                        isPassword
                        value={watch('password') || ''}
                        validationProps={register('password')}
                        errors={errors.password}
                        onClear={() => {
                            resetField('password');
                        }}
                    />
                    <ButtonComponent
                        label="Ingresar"
                        type='submit'
                    />
                </form>
            </section>
        </div>
    );
};
