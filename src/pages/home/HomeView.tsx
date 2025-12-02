import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { getCategories } from '@/services/categories.service';
import { CardComponent } from '@/components/card-component/CardComponent';

import style from './HomeView.module.css';

interface Category {
    name: string;
    description: string;
    destination: string;
}

export const HomeView = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data.data);
        };
        fetchCategories();
    }, []);

    console.log(categories);

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
                        onClick={() => navigate('/' + category.destination)}
                    />
                ))}
            </div>
        </div>
    );
};
