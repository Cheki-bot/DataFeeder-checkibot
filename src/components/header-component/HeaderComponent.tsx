import { SearchComponent } from '../search-component/SearchComponent';

import style from './HeaderComponent.module.css';

interface HeaderComponentProps {
    type: string;
}

export const HeaderComponent = (props: HeaderComponentProps) => {
    return (
        <>
            {props.type === 'simple' ? (
                <header className={style.simpleHeader}>
                    <h1 className={style.title}>Chequea Bolivia</h1>
                    <nav>
                        {/* <InputComponent type='text' label='Busqueda' placeholder='Buscar'/> */}
                    </nav>
                </header>
            ) : (
                <header className={style.header}>
                    <h1 className={style.title}>Chequea Bolivia</h1>
                    <nav>
                        <SearchComponent />
                    </nav>
                </header>
            )}
        </>
    );
};
