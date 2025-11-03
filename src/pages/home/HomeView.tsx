import { CardComponent } from '@/components/card-component/CardComponent';

import { getCategories } from '@/services/categories.service';

import style from './HomeView.module.css';
import { useEffect, useState } from 'react';

interface Category {
    name: string;
    description: string;
}

export const HomeView = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data.data);
        };
        fetchCategories();
    }, []);

    return (
        <div className={style.container}>
            <h2>Elige la categoría</h2>
            <div className={style.cardContainer}>
                {categories.map((category, index) => (
                    <CardComponent
                        key={index}
                        type="horizontal"
                        title={category.name}
                        subtitle={category.description}
                    />
                ))}
            </div>
        </div>
    );
};
