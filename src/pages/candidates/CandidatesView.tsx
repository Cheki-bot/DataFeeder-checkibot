import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ButtonComponent, InputComponent } from '@/components';
import { AddButton } from '@/components/add-button-component/AddButton';
import { ListComponent } from '@/components/list-component/ListComponent';
import { SearchComponent } from '@/components/search-component/SearchComponent';
import {
    candidateSchema,
    type CandidateFormData,
} from './schemas/candidatesSchema';

import { CustomCheckbox } from '@/lib/shared/ui/custom-checkbox';

import style from './CandidatesView.module.css';
import type { Candidate } from '@/interfaces/Candidate';

const CandidatesView = () => {
    const [showForm, setShowForm] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        resetField,
        formState: { errors },
    } = useForm<CandidateFormData>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            fullName: '',
            position: '',
            isActive: false,
        },
    });

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

    const handleAddCandidate = (candidate: Candidate) => {
        console.log(`Adding candidate: ${candidate}`);
        reset();
    };

    const handleRemove = (candidates: Array<Candidate | string>) => {
        const names = candidates.map((c) =>
            typeof c === 'string' ? c : c.fullName
        );
        console.log(`Removing candidates: ${names.join(', ')}`);
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
                                    fillOpacity=".8"
                                    fillRule="evenodd"
                                    d="M6.293 9.657 11.95 4l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-5.657-5.657a1 1 0 0 1 0-1.414Z"
                                    clipRule="evenodd"
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
                        <CustomCheckbox
                            checked={watch('isActive')}
                            onChange={(checked: boolean) => {
                                setValue('isActive', checked);
                            }}
                        />
                    </div>
                    <InputComponent
                        label="Nombre Completo"
                        type="text"
                        value={watch('fullName')}
                        validationProps={register('fullName')}
                        errors={errors.fullName}
                        onClear={() => {
                            resetField('fullName');
                        }}
                    />
                    <InputComponent
                        label="Posición"
                        type="text"
                        value={watch('position')}
                        validationProps={register('position')}
                        errors={errors.position}
                        onClear={() => {
                            resetField('position');
                        }}
                    />
                    <span className={style.buttonContainer}>
                        <ButtonComponent
                            label="Agregar Candidato"
                            type="button"
                            onClick={handleSubmit((data) =>
                                handleAddCandidate(data)
                            )}
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
