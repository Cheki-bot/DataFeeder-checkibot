import PlusIcon from '@/assets/svg/icons/plus-icon';
import { useState } from 'react';
import { ButtonComponent } from '../button-component/ButtonComponent';
import style from './CardComponent.module.css';

type CardType = 'vertical' | 'horizontal';

type CardComponentProps = {
    title?: string;
    subtitle?: string;
    description?: string;
    headerImageUrl?: string;
    mainImageUrl?: string;
    forAddCard?: boolean;
    detailsModal?: () => void;
    type?: CardType;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    Candidates?: () => void;
    GovernmentProgram?: () => void;
    DeleteParty?: () => void;
};

export const CardComponent = (props: CardComponentProps) => {
    const {
        title,
        subtitle,
        description: rawDescription,
        headerImageUrl,
        mainImageUrl,
        forAddCard,
        detailsModal,
        type = 'vertical',
        onEdit,
        onDelete,
        onClick,
        Candidates,
        GovernmentProgram,
    } = props;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const description =
        rawDescription && rawDescription.length > 130
            ? rawDescription.slice(0, 130) + '...'
            : rawDescription;

    const handleMenu = () => setIsMenuOpen(!isMenuOpen);

    if (type === 'horizontal') {
        return (
            <article className={style.horizontalCard}>
                {mainImageUrl && (
                    <img
                        className={style.horizontalImage}
                        src={mainImageUrl}
                        alt="Card Image"
                    />
                )}
                <div
                    className={style.horizontalContent}
                    onClick={onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onClick) onClick();
                    }}
                >
                    <h3 className={style.title}>{title}</h3>
                    <p className={style.subtitle}>{subtitle}</p>
                </div>
            </article>
        );
    }

    return (
        <article
            className={forAddCard ? style.foraddCard : style.card}
            onClick={forAddCard ? detailsModal : undefined}
        >
            {forAddCard ? (
                <div className={style.addCard}>
                    <PlusIcon width={100} height={100} />
                </div>
            ) : (
                <>
                    <div className={style.header}>
                        <div className={style.info}>
                            {headerImageUrl && (
                                <img
                                    className={style.headerImage}
                                    src={headerImageUrl}
                                    alt="Card Image"
                                />
                            )}
                            <span className={style.titles}>
                                <h3 className={style.title}>{title}</h3>
                                <h4 className={style.subtitle}>{subtitle}</h4>
                            </span>
                        </div>
                        <ButtonComponent onlyIcon onClick={handleMenu}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="5"
                                height="18"
                                fill="none"
                                viewBox="0 0 4 12"
                            >
                                <path
                                    fill="#49454F"
                                    d="M1.98 11.655q-.593 0-1.016-.422a1.4 1.4 0 0 1-.422-1.016q0-.594.422-1.017t1.017-.422q.593 0 1.016.422.422.422.422 1.017 0 .593-.422 1.016-.423.422-1.016.422Zm0-4.316q-.593 0-1.016-.423A1.4 1.4 0 0 1 .542 5.9q0-.594.422-1.016t1.017-.423q.593 0 1.016.423.422.422.422 1.016c0 .594-.14.734-.422 1.016q-.423.423-1.016.423Zm0-4.317q-.593 0-1.016-.422a1.4 1.4 0 0 1-.422-1.017Q.542.99.964.567T1.981.144q.593 0 1.016.423.422.423.422 1.016c0 .593-.14.735-.422 1.017q-.423.422-1.016.422Z"
                                />
                            </svg>
                        </ButtonComponent>
                        {isMenuOpen && (
                            <div className={style.menu}>
                                <button
                                    className={style.menuItem}
                                    onClick={() => {
                                        if (detailsModal) detailsModal();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Detalles
                                </button>
                                {onEdit && (
                                    <button
                                        className={style.menuItem}
                                        onClick={() => {
                                            onEdit();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Editar
                                    </button>
                                )}
                                {Candidates && (
                                    <button
                                        className={style.menuItem}
                                        onClick={() => {
                                            if (Candidates) Candidates();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Candidatos
                                    </button>
                                )}
                                {GovernmentProgram && (
                                    <button
                                        className={style.menuItem}
                                        onClick={() => {
                                            if (GovernmentProgram)
                                                GovernmentProgram();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Programa de Gobierno
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className={[
                                            style.menuItem,
                                            style.delete,
                                        ].join(' ')}
                                        onClick={() => {
                                            onDelete();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {mainImageUrl && (
                        <img
                            className={style.image}
                            src={mainImageUrl}
                            alt="Political Party Logo"
                        />
                    )}
                    <div className={style.content}>
                        {description && (
                            <p className={style.description}>{description}</p>
                        )}
                        <ButtonComponent onClick={detailsModal}>
                            Ver más
                        </ButtonComponent>
                    </div>
                </>
            )}
        </article>
    );
};
