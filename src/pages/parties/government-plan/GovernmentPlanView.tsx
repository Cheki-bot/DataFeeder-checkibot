import { ButtonComponent } from '@/components';
import { getCandidacyById } from '@/pages/parties/service/parties.service';
import type { ICandidacy } from '@/interfaces/Candidacies';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './GovernmentPlanView.module.css';

export const GovernmentPlanView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [candidacy, setCandidacy] = useState<ICandidacy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getCandidacyById(id);
                //console.log('Government Plan Data:', data);
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
                    <div className={styles.loading}>Cargando programa de gobierno...</div>
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

                <div className={styles.metadata}>
                    <p>
                        <strong>Partido:</strong> {candidacy?.party?.name || (candidacy as any).name || (candidacy as any).data?.name || 'Nombre no disponible'}
                    </p>
                    {(candidacy?.party?.sigla || (candidacy as any).sigla || (candidacy as any).data?.sigla) && (
                        <p>
                            <strong>Sigla:</strong> {candidacy?.party?.sigla || (candidacy as any).sigla || (candidacy as any).data?.sigla}
                        </p>
                    )}
                </div>

                <div className={styles.planCard}>
                    <div className={styles.planContent}>
                        {(candidacy as any).data?.government_plan || candidacy.government_plan ? (
                            (candidacy as any).data?.government_plan || candidacy.government_plan
                        ) : (
                            <p>No hay un programa de gobierno registrado para este partido.</p>
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
