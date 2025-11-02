import { InputComponent } from '../input-component/InputComponent';
import style from './HeaderComponent.module.css';
export const HeaderComponent = () => {
    return (
        <header className={style.header}>
            <h1>Checkibot</h1>
            <nav>
                <InputComponent type='text' label='Busqueda' placeholder='Buscar'/>
            </nav>
        </header>
    );
};
