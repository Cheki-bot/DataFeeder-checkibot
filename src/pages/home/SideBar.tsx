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
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data.data);
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category.name);
        navigate(`/${category.destination}`)
    }
    
    return (
        <div className={style.container}>
            <h2>Elige la categoría</h2>
            <div className={style.cardContainer}>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={selectedCategory === category.name ? style.optionCardSelected : style.optionCard}
                        onClick={() => {
                            handleCategorySelect(category);
                        }}
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
