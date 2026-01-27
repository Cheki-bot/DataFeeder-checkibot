import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { ButtonComponent } from '@/components';
import { CardComponent } from '@/components/card-component/CardComponent';
import type { IPoliticalParty } from '@/interfaces/Candidacies';
import { PartyDetails } from './details/PartyDetails';
import { deleteCandidacy, getCandidacies } from './service/parties.service';

import style from './PartiesView.module.css';
import { useNotification } from '@/hooks/useNotification';

export const PartiesView = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [parties, setParties] = useState<IPoliticalParty[]>([]);
    const [selectedParty, setSelectedParty] = useState<IPoliticalParty | null>(
        null
    );
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchParties = async () => {
            const response = await getCandidacies();
            setParties(response.data);
        };
        fetchParties();
    }, []);

    const handleDelete = async (id?: string) => {
        if (!id) {
            console.warn('Attempted to delete party without id');
            return;
        }
        await deleteCandidacy(id);
    };

    return (
        <div className={style.container}>
            {isOpen && (
                <PartyDetails
                    onClose={() => setIsOpen(false)}
                    onAccept={() => setIsOpen(false)}
                    data={selectedParty ? selectedParty : undefined}
                />
            )}
            <div className={style.title}>
                <h1>Parties</h1>
                <span className={style.addButton}>
                    <ButtonComponent
                        label="Añadir Nuevo Partido"
                        onClick={() => {
                            navigate('create');
                        }}
                    />
                </span>
            </div>
            <div className={style.cardContainer}>
                {parties.map((item) => (
                    <CardComponent
                        description={item.description}
                        mainImageUrl={
                            item.logoUrl || 'https://picsum.photos/2000/3000'
                        } //MARK: agregar imagenes a la bd
                        subtitle={item.sigla}
                        title={item.name}
                        detailsModal={() => {
                            setIsOpen(true);
                            setSelectedParty(item);
                        }}
                        Candidates={() => {
                            navigate(`candidates/${item.name}/${item.id}/`);
                        }}
                        GovernmentProgram={() => {
                            navigate(`government-program/${item.id}`);
                        }}
                        DeleteParty={() => {
                            handleDelete(item!.id);
                            addNotification(
                                'Partido eliminado correctamente',
                                'success'
                            );
                            setParties((prev) =>
                                prev.filter((party) => party.id !== item.id)
                            );
                        }}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};
