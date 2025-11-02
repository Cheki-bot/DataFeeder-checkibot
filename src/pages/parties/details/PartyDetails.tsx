import { ModalComponent } from '@/components/modal-component/ModalComponent';
import style from './PartyDetails.module.css';

interface PartyDetailsProps {
    onClose: () => void;
    onAccept: () => void;
}

export const PartyDetails = ({ onClose, onAccept }: PartyDetailsProps) => {
    return (
        <ModalComponent onClose={onClose} Accept={onAccept} isOpen={true}>
            <section className={style.partyDetails}>
                <h2>Detalles del Partido</h2>
                <p>Aquí puedes ver los detalles del partido seleccionado.</p>
                <div>
                    <p>
                        Nombre del Partido: MOVIMIENTO DE REGENERACION NACIONAL
                    </p>
                    <p>Sigla: MORENA</p>
                    <p>Fundación: 12 de diciembre de 2023</p>
                    <p>
                        Descripción: Un partido dedicado a promover la justicia
                        social y la igualdad.
                    </p>
                </div>
            </section>
        </ModalComponent>
    );
};
