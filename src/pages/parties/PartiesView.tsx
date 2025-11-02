import { CardComponent } from '@/components/card-component/CardComponent';

import style from './PartiesView.module.css';
import { PartyDetails } from './details/PartyDetails';
import { useState } from 'react';

export const PartiesView = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.container}>
            {isOpen && (
                <PartyDetails
                    onClose={() => setIsOpen(false)}
                    onAccept={() => setIsOpen(false)}
                />
            )}
            <h1 className={style.title}>Parties</h1>
            <div className={style.cardContainer}>
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                    detailsModal={() => setIsOpen(true)}
                />
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                    detailsModal={() => setIsOpen(true)}
                />
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                    detailsModal={() => setIsOpen(true)}
                />

                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                    forAddCard
                />
            </div>
        </div>
    );
};
