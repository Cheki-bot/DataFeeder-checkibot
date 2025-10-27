import { InputComponent } from '@/components';
import { ListComponent } from '@/components/list-component/ListComponent';
import { SearchComponent } from '@/components/search-component/SearchComponent';

import { CustomCheckbox } from '@/lib/shared/ui/custom-checkbox';

import style from './CandidatesView.module.css';

const CandidatesView = () => {
    const candidates = ['Alice', 'Bob', 'Charlie'];
    return (
        <div className={style.container}>
            <h1>Candidates</h1>
            <div className={style.content}>
                <form className={style.form} action="">
                    <div className={style.checkboxField}>
                        <p>Esta activo</p>
                        <CustomCheckbox />
                    </div>
                    <InputComponent label='texto' type='select'/>
                    <InputComponent label="Nombre Completo" type="text" />
                    <InputComponent label="Posición" type="text" />
                </form>
                <div className={style.listContainer}>
                    <SearchComponent />
                    <ListComponent items={candidates} />
                </div>
            </div>
        </div>
    );
};

export default CandidatesView;
