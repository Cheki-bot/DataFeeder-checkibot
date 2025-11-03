import { useState } from 'react';
import { ButtonComponent, InputComponent } from '@/components';
import { ListComponent } from '@/components/list-component/ListComponent';
import { SearchComponent } from '@/components/search-component/SearchComponent';
import { AddButton } from '@/components/add-button-component/AddButton';
import style from './CandidatesView.module.css';
import { CustomCheckbox } from '@/lib/shared/ui/custom-checkbox';

const CandidatesView = () => {
    const [showForm, setShowForm] = useState(false);

    const candidates = [
        'Alice',
        'Bob',
        'Charlie',
        'David',
        'Eve',
        'Bob',
        'Charlie',
        'David',
        'Eve',
        'Bob',
        'Charlie',
        'David',
        'Eve',
    ];

    const handleAddCandidate = (candidate: string) => {
        console.log(`Adding candidate: ${candidate}`);
    };

    const handleRemove = (candidates: string[]) => {
        console.log(`Removing candidates: ${candidates.join(', ')}`);
    };

    return (
        <div className={style.container}>
            {showForm && (
                <div className={style.backButton}>
                    <ButtonComponent
                        onClick={() => setShowForm(false)}
                        type="button"
                        onlyIcon
                    >
                        <div className={style.backContent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill="#ffff"
                                    fill-opacity=".8"
                                    fill-rule="evenodd"
                                    d="M6.293 9.657 11.95 4l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-5.657-5.657a1 1 0 0 1 0-1.414Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <p>Volver</p>
                        </div>
                    </ButtonComponent>
                </div>
            )}
            <h2>Candidatos</h2>

            <div className={style.content}>
                <form
                    className={style.form}
                    style={{
                        display:
                            window.innerWidth <= 768
                                ? showForm
                                    ? 'flex'
                                    : 'none'
                                : 'flex',
                    }}
                >
                    <h3>Información del Candidato</h3>
                    <div className={style.checkboxField}>
                        <p>Esta activo</p>
                        <CustomCheckbox />
                    </div>
                    <InputComponent label="Nombre Completo" type="text" />
                    <InputComponent label="Posición" type="text" />
                    <span className={style.buttonContainer}>
                        <ButtonComponent
                            label="Agregar Candidato"
                            type="button"
                            onClick={() => handleAddCandidate('candidate')}
                        />
                    </span>
                </form>

                {!showForm && (
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
                )}
            </div>

            {!showForm && <AddButton onClick={() => setShowForm(true)} />}
        </div>
    );
};

export default CandidatesView;
