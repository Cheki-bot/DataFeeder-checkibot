import { ModalComponent } from '@/components/modal-component/ModalComponent';
import style from './PartyDetails.module.css';
import type { IPoliticalParty } from '@/interfaces/Candidacies';

interface PartyDetailsProps {
    onClose: () => void;
    onAccept: () => void;
    data?: IPoliticalParty;
}

export const PartyDetails = ({
    onClose,
    onAccept,
    data,
}: PartyDetailsProps) => {
    return (
        <ModalComponent onClose={onClose} Accept={onAccept} isOpen={true}>
            <section className={style.partyDetails}>
                <h2>Detalles del Partido</h2>
                <p>Aquí puedes ver los detalles del partido seleccionado.</p>
                <div className={style.detailsContent}>
                    <p>Nombre del Partido: {data?.name}</p>
                    <p>Sigla: {data?.sigla}</p>
                    <p>
                        Fundación:{' '}
                        {data?.founded || 'No information available.'}
                    </p>
                    <p>
                        Descripción:{' '}
                        {data?.description || 'No description available.'}
                    </p>
                </div>
            </section>
        </ModalComponent>
    );
};
