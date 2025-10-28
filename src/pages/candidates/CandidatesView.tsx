import { ButtonComponent, InputComponent } from '@/components';
import { ListComponent } from '@/components/list-component/ListComponent';
import { SearchComponent } from '@/components/search-component/SearchComponent';

import style from './CandidatesView.module.css';

const CandidatesView = () => {
    const candidates = [
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Eve',
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Eve',
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Eve',
    ];

    const handleAddCandidate = (candidate: string) => {
        console.log(`Adding candidate: ${candidate}`);
    }

    const handleRemove = (candidates: string[]) => {
        console.log(`Removing candidates: ${candidates.join(', ')}`);
    };
    return (
        <div className={style.container}>
            <h1>Candidates</h1>
            <div className={style.content}>
                <form className={style.form} action="">
                    {/* <div className={style.checkboxField}>
                        <p>Esta activo</p>
                        <CustomCheckbox />
                    </div> */}
                    <h3>Información del Candidato</h3>
                    <InputComponent label="Nombre Completo" type="text" />
                    <InputComponent label="Posición" type="text" />
                    <InputComponent
                        label="Estado del candidato"
                        type="select"
                        options={['option1', 'option2']}
                    />
                    <span className={style.buttonContainer}>
                        <ButtonComponent
                            label="Agregar Candidato"
                            type="button"
                            onClick={() => handleAddCandidate("candidate")}
                        />
                    </span>
                </form>
                <div className={style.listContainer}>
                    <SearchComponent />
                    <ListComponent items={candidates} />
                    <span className={style.buttonContainer}>
                        <ButtonComponent
                            label="Eliminar"
                            type="button"
                            danger
                            onClick={() => handleRemove(candidates)}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CandidatesView;
