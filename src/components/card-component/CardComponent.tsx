import { useState } from 'react';
import { ButtonComponent } from '../button-component/ButtonComponent';
import style from './CardComponent.module.css';
import PlusIcon from '@/assets/svg/icons/plus-icon';

type CardComponentProps = {
    title?: string;
    subtitle?: string;
    description?: string;
    headerImageUrl?: string;
    mainImageUrl?: string;
    forAddCard?: boolean;
};

export const CardComponent = (props: CardComponentProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const description =
        props.description && props.description.length > 130
            ? props.description.slice(0, 130) + '...'
            : props.description;

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <article className={props.forAddCard ? style.foraddCard : style.card}>
            {props.forAddCard ? (
                <div className={style.addCard}>
                    <PlusIcon width={100} height={100} />
                </div>
            ) : (
                <>
                    <div className={style.header}>
                        <div className={style.info}>
                            <img
                                className={style.headerImage}
                                src={props.headerImageUrl}
                                alt="Card Image"
                            />
                            <span className={style.titles}>
                                <h3 className={style.title}>{props.title}</h3>
                                <h4 className={style.subtitle}>
                                    {props.subtitle}
                                </h4>
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
                                <button className={style.menuItem}>
                                    Detalles
                                </button>
                                <button className={style.menuItem}>
                                    Candidatos
                                </button>
                                <button className={style.menuItem}>
                                    Programa de Gobierno
                                </button>
                                <button className={[style.menuItem, style.delete].join(' ')}>
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                    <img
                        className={style.image}
                        src={props.mainImageUrl}
                        alt="Political Party Logo"
                    />
                    <div className={style.content}>
                        <p className={style.description}>{description}</p>
                        <ButtonComponent>Ver más</ButtonComponent>
                    </div>
                </>
            )}
        </article>
    );
};
