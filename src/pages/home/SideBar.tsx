import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { getCategories } from '@/services/categories.service';

import style from './Sidebar.module.css';

interface Category {
    name: string;
    description: string;
    destination: string;
}

export const Sidebar = () => {
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
                    <div
                        key={index}
                        className={style.optionCard}
                        onClick={() => navigate(`/${category.destination}`)}
                    >
                        <h4 className={style.optionCardTitle}>
                            {category.name}
                        </h4>
                        <p className={style.optionCardDescription}>
                            {category.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
