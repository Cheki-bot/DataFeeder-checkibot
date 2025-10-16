import { ButtonComponent, InputComponent } from '@components';

import style from './SignUpView.module.css';

export const SignUpView = () => {
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
                        placeholder="Agrega tu nombre de usuario"
                    />
                    <InputComponent
                        label="Correo electrónico"
                        type="text"
                        placeholder="Agrega tu correo electrónico"
                    />
                    <InputComponent
                        label="Contraseña"
                        type="password"
                        placeholder="Agrega tu contraseña"
                    />
                    <InputComponent
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="Agrega tu contraseña"
                    />
                    <ButtonComponent label="Ingresar" onClick={() => {}} />
                </div>
            </section>
        </div>
    );
};
