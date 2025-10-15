import { ButtonComponent } from '../../../components/button-component/ButtonComponent';
import { InputComponent } from '../../../components/input-component/InputComponent';
import style from './LoginView.module.css';

export const LoginView = () => {
    return (
        <div className={style.login}>
            <section className={style.imageSection}>
                <img
                    className={style.image}
                    src="https://picsum.photos/2000/3000/?random"
                    alt="Chequea Bolivia Image"
                />
                <span className={style.imageOverlay}>
                    <img className={style.imageLogo} src="/Logo_ChequeaBolivia.png" alt="Logo Chequea Bolivia" />
                </span>
            </section>
            <section className={style.loginSection}>
                <div className={style.form}>
                    <h2>Iniciar sesión</h2>
                    <InputComponent
                        label="Usuario"
                        type="text"
                        placeholder="Agrega tu nombre de usuario"
                    />
                    <InputComponent
                        label="Contraseña"
                        type="password"
                        placeholder="Agrega tu contraseña"
                    />
                    <ButtonComponent label="Ingresar" onClick={() => {}} />
                </div>
            </section>
        </div>
    );
};
