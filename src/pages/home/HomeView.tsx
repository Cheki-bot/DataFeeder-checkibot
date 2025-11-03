import { useEffect, useState } from 'react';

import { setActiveTab } from '@/lib/state/homeSlice';
import { useDispatch } from 'react-redux';

import { CardComponent } from '@/components/card-component/CardComponent';
import { getCategories } from '@/services/categories.service';

import style from './HomeView.module.css';

interface Category {
    name: string;
    description: string;
    destination: string;
}

export const HomeView = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const dispatch = useDispatch();

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
                        onClick={() => {
                            dispatch(setActiveTab(category.destination));
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
