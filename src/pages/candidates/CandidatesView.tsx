import { useEffect, useState } from 'react';

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

import type { Candidate } from '@/interfaces/Candidacies';
import {
    createCandidate,
    deleteCandidate,
    getCandidatesByPartyId,
} from '@/services/candidates.service';
import { useNavigate, useParams } from 'react-router';
import style from './CandidatesView.module.css';

const CandidatesView = () => {
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(
        []
    );
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
            full_name: '',
            position: '',
            isActive: false,
        },
    });
    const { partyId, partyName } = useParams<{
        partyId: string;
        partyName: string;
    }>();
    const navigation = useNavigate();

    useEffect(() => {
        const loadCandidates = async () => {
            if (!partyId) return;
            try {
                const candidates = await getCandidatesByPartyId(partyId);
                setCandidates(candidates.data);
            } catch (error) {
                console.error('Error loading candidates:', error);
            }
        };
        loadCandidates();
    }, [partyId, setCandidates]);

    useEffect(() => {
        setFilteredCandidates(candidates);
    }, [candidates]);

    const loadCandidates = async () => {
        if (!partyId) return;
        try {
            const candidates = await getCandidatesByPartyId(partyId);
            setCandidates(candidates.data);
        } catch (error) {
            console.error('Error loading candidates:', error);
        }
    };

    const handleAddCandidate = async (candidate: CandidateFormData) => {
        if (!partyId) return;

        try {
            await createCandidate({
                ...candidate,
                is_active: candidate.isActive,
                candidacyId: partyId,
            });
            await loadCandidates();
            reset();
            setShowForm(false);
        } catch (error) {
            console.error('Error adding candidate:', error);
        }
    };

    const handleRemove = async (
        candidatesToRemove: Array<Candidate | string>
    ) => {
        if (!partyId || candidatesToRemove.length === 0) return;

        try {
            const promises = candidatesToRemove.map((c) => {
                const candidateName = typeof c === 'string' ? c : c.full_name;
                return deleteCandidate(partyId, candidateName);
            });

            await Promise.all(promises);
            await loadCandidates();
            setSelectedCandidates([]);
        } catch (error) {
            console.error('Error removing candidates:', error);
        }
    };

    return (
        <div className={style.container}>
            <p className={style.backButtonMain} onClick={() => navigation(-1)}>
                Volver
            </p>
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
            <h2>Candidatos de {partyName}</h2>

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
                        value={watch('full_name')}
                        validationProps={register('full_name')}
                        errors={errors.full_name}
                        onClear={() => {
                            resetField('full_name');
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
                        {/* <SearchComponent
                            data={candidates.map((candidate) => ({
                                id: candidate.id
                                    ? Number(candidate.id)
                                    : undefined,
                                name: candidate.full_name,
                            }))}
                            searchKeys={['full_name', 'position', 'name']}
                            onResultsChange={(results) => {
                                setFilteredCandidates(
                                    candidates.filter((c) =>
                                        results.some((r) => r.id === c.id)
                                    )
                                );
                            }}
                            hasDropdown={false}
                        />
                        <ListComponent
                            items={filteredCandidates.map((candidate) => ({
                                label: candidate.full_name,
                                subLabel: candidate.position,
                            }))}
                        /> */}
                        <SearchComponent
                            data={candidates.map((candidate) => ({
                                id: candidate.id
                                    ? Number(candidate.id)
                                    : undefined,
                                name: candidate.full_name,
                            }))}
                            searchKeys={['full_name', 'position', 'name']}
                            onResultsChange={(results) => {
                                setFilteredCandidates(
                                    candidates.filter((c) =>
                                        results.some((r) => r.id === c.id)
                                    )
                                );
                            }}
                            hasDropdown={false}
                        />
                        <ListComponent
                            items={filteredCandidates.map((candidate) => ({
                                label: candidate.full_name,
                                subLabel: candidate.position,
                            }))}
                            onSelectionChange={(selected) => {
                                setSelectedCandidates(
                                    selected.map((s) => s.label)
                                );
                            }}
                        />
                        <span className={style.buttonContainer}>
                            <ButtonComponent
                                label="Eliminar"
                                type="button"
                                danger
                                onClick={() => handleRemove(selectedCandidates)}
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
