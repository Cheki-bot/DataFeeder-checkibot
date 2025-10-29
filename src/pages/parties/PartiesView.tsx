import { CardComponent } from '@/components/card-component/CardComponent';

import style from './PartiesView.module.css';

export const PartiesView = () => {
    return (
        <div className={style.container}>
            <h1 className={style.title}>Parties</h1>
            <div className={style.cardContainer}>
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                />
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
                />
                <CardComponent
                    description="This is a sample description for the card componensample description for the card componensample description for the card componensample description for the card component. lorem ipsum dolor sit amet, consectetur adipiscing elit. sadsadsasa s s s s s"
                    headerImageUrl="https://picsum.photos/300/300"
                    mainImageUrl="https://picsum.photos/2000/3000"
                    subtitle="Sample Subtitle"
                    title="Sample Title"
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
