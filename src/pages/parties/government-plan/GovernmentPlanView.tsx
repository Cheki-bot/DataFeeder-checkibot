import { ButtonComponent } from '@/components';
import { getCandidacyById } from '@/pages/parties/service/parties.service';
import type { ICandidacy } from '@/interfaces/Candidacies';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './GovernmentPlanView.module.css';

interface CandidacyWithData extends ICandidacy {
    data?: ICandidacy;
}

export const GovernmentPlanView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [candidacy, setCandidacy] = useState<CandidacyWithData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getCandidacyById(id);
                setCandidacy(data);
            } catch (err) {
                console.error('Error fetching government plan:', err);
                setError('Error al cargar el programa de gobierno.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.loading}>
                        Cargando programa de gobierno...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !candidacy) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.error}>
                        {error || 'Partido no encontrado'}
                    </div>
                    <div className={styles.buttonGroup}>
                        <ButtonComponent
                            label="Volver"
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Programa de Gobierno</h1>

                <div className={styles.planCard}>
                    <div className={styles.planContent}>
                        {candidacy.data?.government_plan ||
                            candidacy.government_plan ? (
                            candidacy.data?.government_plan ||
                            candidacy.government_plan
                        ) : (
                            <p>
                                No hay un programa de gobierno registrado para
                                este partido.
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <ButtonComponent
                        label="Volver"
                        onClick={() => navigate(-1)}
                    />
                </div>
            </div>
        </div>
    );
};
